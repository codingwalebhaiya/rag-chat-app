
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login, loading, setLoading } = useAuth();

 // const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login(form);

      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Email
        </label>

        <input
          type="text"
          required
          className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter email or username"
          value={form.identifier}
          onChange={(e) =>
            setForm({
              ...form,
              identifier: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Password
        </label>

        <input
          type="password"
          required
          className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Signing In..." : "Login"}
      </button>
    </form>
  );
}