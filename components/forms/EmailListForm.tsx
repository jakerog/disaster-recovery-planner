"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StatusMessage from "@/components/ui/StatusMessage";
import { Users, Mail, Save, Plus } from "lucide-react";

export default function EmailListForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/email-lists", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.refresh();
        (e.target as HTMLFormElement).reset();
        setStatus("Communication Pool Initialized");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("Failed to create list");
      }
    } catch (error) {
      console.error(error);
      setStatus("Operation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="clean-card p-8 rounded-[2rem] space-y-6 mb-12 text-slate-900 shadow-xl shadow-slate-200/50">
      <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <Users size={20} />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter">New Communication Pool</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Pool Designation (Name)</label>
          <input name="name" required className="w-full bg-transparent border-none text-sm font-bold focus:ring-0" placeholder="e.g. Crisis Response Alpha" />
        </div>
        <div className="clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Recipient Nodes (Emails)</label>
          <textarea name="emails" required className="w-full bg-transparent border-none text-sm font-bold focus:ring-0 min-h-[40px] resize-none" placeholder="agent1@sentinel.cloud, agent2@sentinel.cloud" />
        </div>
      </div>

      <StatusMessage message={status} />

      <button type="submit" disabled={loading} className="w-full clean-button py-4 text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
        <Plus size={14} />
        {loading ? "Initializing..." : "Commit Pool Definition"}
      </button>
    </form>
  );
}
