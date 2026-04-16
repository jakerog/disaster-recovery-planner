"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, email, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Operation failed.");
      }
    } catch (err) {
      setError("Transmission fault.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full clean-card p-12 text-center border-dashed">
          <p className="text-slate-400 font-bold uppercase tracking-widest">Invalid Reset Stream</p>
          <Link href="/login" className="mt-8 inline-block clean-button px-8 py-3">Return to Node</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full clean-card p-12 text-center">
          <div className="flex justify-center mb-6 text-emerald-500">
            <CheckCircle2 size={64} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Credentials Synchronized</h2>
          <p className="text-sm font-bold text-slate-400 leading-relaxed">Your security profile has been updated. Redirecting to primary login node...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full clean-card p-8 md:p-12">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
            <Lock size={32} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-2 uppercase">Credential Override</h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Security Token Validated for {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="clean-input"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Confirm Identity</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="clean-input"
              required
            />
          </div>

          {error && <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full clean-button py-4 text-[11px] font-black uppercase tracking-[0.3em] shadow-lg"
          >
            {loading ? "Transmitting..." : "Override Credentials"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
