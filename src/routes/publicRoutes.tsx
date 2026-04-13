import { Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/Signup";
import OtpPage from "../pages/OtpPage";
import OAuthSuccess from "../pages/OAuthSuccess";
import GoogleStart from "../pages/GoogleStart";
import ForgotPasswordEmailPage from "../pages/ForgotPasswordEmailPage";
import ForgotPasswordOtpPage from "../pages/ForgotPasswordOtpPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import { ROUTES } from "../constants/routes";



export const PublicRoutes = () => (
  <>
    <Route path={ROUTES.HOME} element={<Home />} />
    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path={ROUTES.SIGNUP} element={<SignUp />} />
    <Route path={ROUTES.OTP} element={<OtpPage />} />

    <Route path={ROUTES.GOOGLE_START} element={<GoogleStart />} />
    <Route path={ROUTES.OAUTH_SUCCESS} element={<OAuthSuccess />} />

    <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordEmailPage />} />
    <Route path={ROUTES.FORGOT_PASSWORD_OTP} element={<ForgotPasswordOtpPage />} />
    <Route path={ROUTES.FORGOT_PASSWORD_RESET} element={<ResetPasswordPage />} />

  </>
);
