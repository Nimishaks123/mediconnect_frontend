import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { socketService } from "../services/socketService";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/auth/authSlice";

export const useBlockListener = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(
    (state) => state.auth.user
  );

  useEffect(() => {
    const socket =
      socketService.getSocket();

    if (!socket || !user) return;

    const handleBlocked = (
      data: {
        userId: string;
        blocked: boolean;
      }
    ) => {
      if (
        data.userId === user.id &&
        data.blocked
      ) {
        toast.error(
          "Your account has been blocked by administrator"
        );

        setTimeout(() => {
             console.log("DISPATCHING LOGOUT");
          dispatch(logout());
           console.log("AFTER LOGOUT");

       
        }, 1500);
      }
    };

    socket.on(
      "user_block_status_changed",
      handleBlocked
    );

    return () => {
      socket.off(
        "user_block_status_changed",
        handleBlocked
      );
    };
  }, [
    user,
    dispatch,
    navigate,
  ]);
};