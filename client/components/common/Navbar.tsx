// src/components/common/Navbar.tsx

"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="p-4 border flex gap-4">
      <Link href="/">Home</Link>

      {user ? (
        <Link href="/dashboard">Dashboard</Link>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </nav>
  );
}