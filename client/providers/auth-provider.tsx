"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfile } from "@/queries/auth.query";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [initialized, setInitialized] = useState(false);

  const { data, isSuccess, isError, isLoading } = useProfile();

  useEffect(() => {
    if (isLoading) return;

    if (isSuccess && data?.data) {
      setAuth(data.data);
    }

    if (isError) {
      clearAuth();
    }

    setInitialized(true);
  }, [
    isLoading,
    isSuccess,
    isError,
    data,
    setAuth,
    clearAuth,
  ]);

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}