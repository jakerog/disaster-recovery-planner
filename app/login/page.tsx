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
    <div className="min-h-screen bg-white flex items-center justify-center p-8 font-sans">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-12">
          <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center text-white shadow-2xl">
            <Shield size={40} />
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Sentinel</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Secure DR Access Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Access System"}
          </button>
        </form>

        <p className="mt-12 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
          Authored by Sentinel Global Operations
        </p>
      </div>
    </div>
  );
}
