"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@sentinel.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full clean-card p-8 md:p-12">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Shield size={32} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Sentinel</h1>
          <p className="text-sm text-slate-500 font-medium">Disaster Recovery Command Node</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="clean-input"
              placeholder="user@sentinel.cloud"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="clean-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full clean-button py-3 text-sm uppercase tracking-widest"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="mt-10 text-center text-xs font-medium text-slate-300 uppercase tracking-widest">
          Secure Terminal v2.0
        </p>
      </div>
    </div>
  );
}
