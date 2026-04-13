import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { loadUserFromToken, selectCurrentUser } from "./store/auth/authSlice";
import AppRoutes from "./routes";
import { socketService } from "./services/socketService";

export default function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) dispatch(loadUserFromToken(token));
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      socketService.connect(user.id);
    } else {
      socketService.disconnect();
    }
  }, [user]);

  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  );
}
