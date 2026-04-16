"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

export default function StatusMessage({ message, type = "success" }: { message: string, type?: "success" | "error" }) {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
      type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
    }`}>
      {type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <p className="text-xs font-black uppercase tracking-widest">{message}</p>
    </div>
  );
}
