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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8 font-sans">
      <div className="max-w-md w-full skeuo-card p-12 rounded-[2.5rem]">
        <div className="flex justify-center mb-10">
          <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-8 ring-white">
            <Shield size={48} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-black">Sentinel</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Secure Access Node</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="skeuo-inset p-2 px-4">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1 px-1" htmlFor="email">
              Identity Protocol
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent p-2 text-sm font-bold focus:outline-none text-black"
              placeholder="user@sentinel.cloud"
              required
            />
          </div>

          <div className="skeuo-inset p-2 px-4">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1 px-1" htmlFor="password">
              Access Code
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent p-2 text-sm font-bold focus:outline-none text-black"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full skeuo-button text-white p-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Establish Connection"}
          </button>
        </form>

        <p className="mt-12 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
          End-to-End Encrypted Terminal
        </p>
      </div>
    </div>
  );
}
