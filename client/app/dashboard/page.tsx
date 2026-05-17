
"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        Welcome {user?.username}
      </h1>

      <p>{user?.email}</p>

      <button
        onClick={logout}
        className="mt-4 border px-4 py-2"
      >
        Logout
      </button>
    </div>
  );
}