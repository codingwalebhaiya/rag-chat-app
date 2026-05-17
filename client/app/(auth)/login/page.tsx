
import React from 'react'
import { Metadata } from "next";
import Link from "next/link";
import LoginForm from '@/components/form/LoginForm';

export const metadata: Metadata = {
  title: "Login - Blog App",
  description: "Login to your account",
};
const LoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Welcome Back
          </h1>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-500 hover:text-blue-600 hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default LoginPage