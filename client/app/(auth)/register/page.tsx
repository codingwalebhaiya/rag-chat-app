
import React from 'react'
import { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/form/RegisterForm";

export const metadata: Metadata = {
  title: "Register - Blog App",
  description: "Create a new account to start blogging",
};
const RegisterPage = () => {

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">

          <div className="text-center mb-8 ">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create an Account
            </h1>
            <p className="text-gray-600">
              Join our community and start sharing your thoughts
            </p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div></div>
      </div>
    </div>
  );
}


export default RegisterPage