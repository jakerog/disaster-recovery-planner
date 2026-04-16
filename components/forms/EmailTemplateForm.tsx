"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StatusMessage from "@/components/ui/StatusMessage";
import { Mail, Save, FileText, ClipboardList } from "lucide-react";

export default function EmailTemplateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/email-templates", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.refresh();
        (e.target as HTMLFormElement).reset();
        setStatus("Communication Protocol Saved");
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("Failed to create template");
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
          <ClipboardList size={20} />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tighter">New Transmission Template</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Internal Alias (Name)</label>
          <input name="name" required className="w-full bg-transparent border-none text-sm font-bold focus:ring-0" placeholder="e.g. Critical Failover Notification" />
        </div>
        <div className="clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Broadcast Subject</label>
          <input name="subject" required className="w-full bg-transparent border-none text-sm font-bold focus:ring-0" placeholder="[URGENT] Recovery Operation Sequence Initiation" />
        </div>
        <div className="md:col-span-2 clean-inset p-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Operational Payload (Body)</label>
          <textarea name="body" required className="w-full bg-transparent border-none text-sm font-bold focus:ring-0 min-h-[120px] resize-none" placeholder="Detail the recovery instructions or status update..." />
        </div>
      </div>

      <StatusMessage message={status} />

      <button type="submit" disabled={loading} className="w-full clean-button py-4 text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
        <Save size={14} />
        {loading ? "Archiving..." : "Commit Protocol Template"}
      </button>
    </form>
  );
}
