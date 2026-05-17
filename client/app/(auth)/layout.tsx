// app/(auth)/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Login or register to access your account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}