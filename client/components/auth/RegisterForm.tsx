// components/auth/RegisterForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRegister } from "@/queries/auth.query"
import { RegisterSchema, type RegisterInput } from "@/schemas/auth.schema";
import { Loader2 } from "lucide-react";

export default function RegisterForm() {
    const router = useRouter();
    const { mutate: register, isPending, error } = useRegister();

    const {
        register: registerForm,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: ""
        },
    });

    function onSubmit(values: RegisterInput) {

        register(values, {
            onSuccess: () => {
                router.push("/login");
            },
        });
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">Create an account</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                    Enter your details below to set up your profile.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-zinc-300" htmlFor="name">
                        Name
                    </label>
                    <input
                        id="name"
                        placeholder="John Doe"
                        {...registerForm("name")}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-transparent outline-none transition focus:ring-2 focus:ring-black dark:focus:ring-white border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-50"
                    />
                    {errors.name && (
                        <p className="text-xs font-medium text-red-500">{errors.name.message}</p>
                    )}
                </div>

                {/* Username Field */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-zinc-300" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        placeholder="johndoe123"
                        {...registerForm("username")}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-transparent outline-none transition focus:ring-2 focus:ring-black dark:focus:ring-white border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-50"
                    />
                    {errors.username && (
                        <p className="text-xs font-medium text-red-500">{errors.username.message}</p>
                    )}
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-zinc-300" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        {...registerForm("email")}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-transparent outline-none transition focus:ring-2 focus:ring-black dark:focus:ring-white border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-50"
                    />
                    {errors.email && (
                        <p className="text-xs font-medium text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-zinc-300" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...registerForm("password")}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-transparent outline-none transition focus:ring-2 focus:ring-black dark:focus:ring-white border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-50"
                    />
                    {errors.password && (
                        <p className="text-xs font-medium text-red-500">{errors.password.message}</p>
                    )}
                </div>

                {/* TanStack Query Error State */}
                {error && (
                    <p className="text-sm font-medium text-red-500 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-md border border-red-200 dark:border-red-900/50">
                        {error?.message || "Registration failed. Please try again."}
                    </p>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 font-medium py-2 px-4 rounded-md text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isPending ? "Creating account..." : "Register"}
                </button>
            </form>
        </div>
    );
}
