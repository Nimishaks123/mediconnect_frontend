import { useState, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../store/auth/authSlice";
import type { AuthUser } from "../store/auth/authSlice";

export function useHydratedAuth() {
  const reduxUser = useAppSelector(selectCurrentUser);
  const accessToken = localStorage.getItem("accessToken");

  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // If redux already has a user → use it
    if (reduxUser) {
      setUser(reduxUser);
      setHydrated(true);
      return;
    }

    // Otherwise load from localStorage
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      setUser(JSON.parse(stored) as AuthUser);
    }

    setHydrated(true);
  }, [reduxUser]);

  return { user, accessToken, hydrated };
}
