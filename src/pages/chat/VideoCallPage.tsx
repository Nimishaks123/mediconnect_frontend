import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socketService } from "../../services/socketService";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/auth/authSlice";
import { api } from "../../api/api";
import { 
  MicrophoneIcon, 
  VideoCameraIcon, 
  PhoneXMarkIcon,
  VideoCameraSlashIcon
} from "@heroicons/react/24/solid";
import { showInfo, showError } from "../../utils/toastUtils";
import { ROLES } from "../../constants/roles";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const VideoCallPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const { status: callStatus } = useAppSelector((state) => state.call);
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socket = socketService.getSocket();

  const role = user?.role === ROLES.DOCTOR ? "Doctor" : "Patient";
  const isInitiator = user?.role === ROLES.DOCTOR;
  const hasJoinedRoom = useRef(false);
  const hasCreatedOffer = useRef(false);
  const hasAnswered = useRef(false);
  const hasHandledPeerJoin = useRef(false);
  const hasCleanedUp = useRef(false);
  const hasInitializedPC = useRef(false);

  const cleanupCall = () => {
    if (hasCleanedUp.current) return;
    hasCleanedUp.current = true;

    console.log(`[System] Cleanup only on exit: [${role}]`);
    
    localStream?.getTracks().forEach(track => track.stop());
    
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    socket?.off("user_joined");
    socket?.off("offer");
    socket?.off("answer");
    socket?.off("ice_candidate");
    socket?.off("user_left");
    socket?.off("call_rejected");
    socket?.emit("leave_call", { appointmentId });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get(`/call/eligible/${appointmentId}`);
        if (!res.data.eligible) {
          showError("Unauthorized access to this call.");
          navigate("/");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        if (!socket) {
          showError("Socket not connected.");
          return;
        }

        if (!hasJoinedRoom.current) {
          console.log(`[${role}] Join once: ${appointmentId}`);
          socket.emit("join_call", { appointmentId, userId: user?.id });
          hasJoinedRoom.current = true;
        }

        setupSignaling();

      } catch (err) {
        console.error(`[${role}] Video Call Error:`, err);
        showError("Could not start video call. Check camera permissions.");
        navigate(-1);
      }
    };

    init();

    return () => {
      cleanupCall();
    };
  }, [appointmentId, socket]);

  const setupSignaling = () => {
    if (!socket) return;

    // Reset guards for the case of re-initialization
    hasCreatedOffer.current = false;
    hasAnswered.current = false;
    hasHandledPeerJoin.current = false;

    // Clean listeners before registering as per PART 5
    socket.off("user_joined");
    socket.off("offer");
    socket.off("answer");
    socket.off("ice_candidate");
    socket.off("user_left");
    socket.off("call_rejected");

    socket.on("user_joined", async () => {
      if (hasHandledPeerJoin.current) {
        console.log(`[System] Ignoring duplicate user_joined for [${role}]`);
        return;
      }
      hasHandledPeerJoin.current = true;

      const pc = getOrCreatePC();
      if (!pc || pc.signalingState === "closed") return;

      console.log(`[${role}] Peer joined. State: ${pc.signalingState}`);
      
      if (isInitiator && pc.signalingState === "stable" && !hasCreatedOffer.current) {
        console.log(`[Doctor] Offer created once`);
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", { appointmentId, offer });
          hasCreatedOffer.current = true;
        } catch (err) {
          console.error(`[${role}] Create Offer Error:`, err);
        }
      }
    });

    socket.on("offer", async (data: { offer: RTCSessionDescriptionInit }) => {
      if (hasAnswered.current) {
        console.log(`[System] Ignoring duplicate offer for [${role}]`);
        return;
      }

      const pc = getOrCreatePC();
      if (!pc || pc.signalingState === "closed") return;

      if (pc.signalingState !== "stable") {
        console.warn(`[${role}] Ignoring offer received in state: ${pc.signalingState}`);
        return;
      }

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        if ((pc.signalingState as RTCSignalingState) === "have-remote-offer" && !hasAnswered.current) {
          console.log(`[Patient] Answer created once`);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { appointmentId, answer });
          hasAnswered.current = true;
        }
      } catch (err) {
        console.error(`[${role}] Handle Offer Error:`, err);
      }
    });

    socket.on("answer", async (data: { answer: RTCSessionDescriptionInit }) => {
      const pc = pcRef.current;
      if (!pc || pc.signalingState === "closed") return;

      if (pc.signalingState !== "have-local-offer") {
        console.log(`[System] Ignoring duplicate answer for [${role}]`);
        return;
      }

      try {
        console.log(`[Doctor] Answer created once / Connecting...`);
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } catch (err) {
        console.error(`[${role}] Handle Answer Error:`, err);
      }
    });

    socket.on("ice_candidate", async (data: { candidate: RTCIceCandidateInit }) => {
      const pc = getOrCreatePC();
      if (!pc || pc.signalingState === "closed") return;

      try {
        if (data.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (err) {
        console.error(`[${role}] Add ICE Candidate Error:`, err);
      }
    });

    socket.on("user_left", () => {
      console.log(`[${role}] Peer disconnected.`);
      showInfo("Peer disconnected.");
      setRemoteStream(null);
    });

    socket.on("call_rejected", () => {
      console.log(`[${role}] Call rejected.`);
      showError("Call was rejected.");
      navigate(-1);
    });
  };

  const getOrCreatePC = () => {
    if (pcRef.current && pcRef.current.signalingState !== "closed") return pcRef.current;

    if (!hasInitializedPC.current) {
      console.log(`[${role}] Initializing PeerConnection once`);
      const pc = new RTCPeerConnection(ICE_SERVERS);

      if (localStream) {
        localStream.getTracks().forEach(track => {
          pc.addTrack(track, localStream);
        });
      }

      pc.ontrack = (event) => {
        console.log(`[${role}] Remote track received.`);
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("ice_candidate", { appointmentId, candidate: event.candidate });
        }
      };

      pcRef.current = pc;
      hasInitializedPC.current = true;
      return pc;
    }
    
    return pcRef.current!;
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  const endCall = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mediconnect-green to-transparent opacity-50" />

      <div className="relative w-full h-full flex items-center justify-center">
        {remoteStream ? (
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover animate-in fade-in duration-1000"
          />
        ) : (
          <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-700">
             <div className="w-24 h-24 rounded-full bg-mediconnect-green/10 flex items-center justify-center border border-mediconnect-green/20">
                <div className="w-16 h-16 rounded-full bg-mediconnect-green flex items-center justify-center shadow-lg shadow-mediconnect-green/30 animate-pulse">
                   <VideoCameraIcon className="w-8 h-8 text-white" />
                </div>
             </div>
             <div className="text-center">
                <h2 className="text-white text-lg font-black uppercase tracking-[0.2em] italic mb-2">
                   {user?.role === ROLES.DOCTOR ? "Calling Patient..." : "Connecting to Doctor..."}
                </h2>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                   {user?.role === ROLES.DOCTOR 
                     ? "Waiting for the patient to accept the invitation" 
                     : "Wait for the other participant to establish a secure link"}
                </p>
             </div>
          </div>
        )}

        {/* Local Video Small Box */}
        <div className="absolute top-8 right-8 w-48 h-32 rounded-3xl bg-slate-800 border-2 border-white/10 shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-500 z-30">
           <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
           />
           {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-700">
                 <VideoCameraIcon className="w-8 h-8 text-slate-500" />
              </div>
           )}
           <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
              You
           </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-40">
        <button 
           onClick={toggleMute}
           className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 shadow-red-500/20' : 'bg-slate-800 hover:bg-slate-700 shadow-slate-900/40'} border border-white/5 shadow-2xl active:scale-95`}
        >
           <MicrophoneIcon className="w-6 h-6 text-white" />
        </button>

        <button 
           onClick={endCall}
           className="w-20 h-20 rounded-3xl bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-2xl shadow-red-600/30 border-2 border-white/20 active:scale-90 transition-all group"
        >
           <PhoneXMarkIcon className="w-10 h-10 text-white" />
        </button>

        <button 
           onClick={toggleVideo}
           className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500 shadow-red-500/20' : 'bg-slate-800 hover:bg-slate-700 shadow-slate-900/40'} border border-white/5 shadow-2xl active:scale-95`}
        >
           <VideoCameraIcon className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="absolute top-8 left-8 flex items-center gap-4 z-40">
         <div className="px-4 py-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-mediconnect-green animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.1em]">Encrypted Session</span>
         </div>
      </div>
    </div>
  );
};

export default VideoCallPage;
