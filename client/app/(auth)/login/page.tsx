
// DO NOT write 'use client' here. This remains a Server Component.

import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-md space-y-4">
                <LoginForm />
                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </main>
    );
}
