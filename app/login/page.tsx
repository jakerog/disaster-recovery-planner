"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { Shield, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

function LoginContent() {
  const [email, setEmail] = useState("admin@sentinel.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full clean-card p-8 md:p-12">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-slide-up">
            <AlertCircle size={18} />
            <p className="text-xs font-black uppercase tracking-widest">Authentication Failed</p>
          </div>
        )}
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full clean-card p-8 md:p-12 text-center">
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Initializing Terminal...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
