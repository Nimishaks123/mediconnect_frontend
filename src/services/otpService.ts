import { otpApi } from "../api/otpApi";
export const otpService={
    verifyOtp:async(email:string,code:string)=>{
        const res=await otpApi.verifyOtp(email,code);
        return res.data;
    },
    resendOtp:async(email:string)=>{
        const res=await otpApi.resendOtp(email);
        return res.data;
    }
};