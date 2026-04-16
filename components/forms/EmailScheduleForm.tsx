"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmailTemplate, EmailList } from "@prisma/client";
import { Send, Calendar, Clock, CheckCircle2 } from "lucide-react";
import StatusMessage from "@/components/ui/StatusMessage";

export default function EmailScheduleForm({ templates, lists }: { templates: EmailTemplate[], lists: EmailList[] }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const templateId = formData.get("templateId") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;

    if (selectedListIds.length === 0) {
      setStatus("Select at least one recipient pool.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/email-schedule", {
        method: "POST",
        body: JSON.stringify({
          templateId,
          listIds: selectedListIds,
          scheduledAt: new Date(`${date}T${time}`),
        }),
      });

      if (res.ok) {
        setStatus("Broadcast Scheduled");
        router.refresh();
        (e.target as HTMLFormElement).reset();
        setSelectedListIds([]);
      }
    } catch (err) {
      setStatus("Scheduling Failure");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="clean-card p-10 rounded-[2.5rem] space-y-8 mb-12 shadow-xl shadow-slate-200/50">
      <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
        <div className="p-3 bg-blue-600 rounded-2xl text-white">
          <Send size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Schedule Broadcast</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recovery Notification Dispatch</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="clean-inset p-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Message Protocol (Template)</label>
            <select name="templateId" required className="w-full bg-transparent border-none text-sm font-bold focus:ring-0 appearance-none">
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="clean-inset p-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Dispatch Window</label>
            <div className="flex gap-4">
              <input name="date" type="date" required className="flex-1 bg-white/50 border-none rounded-lg p-2 text-xs font-bold" defaultValue={new Date().toISOString().split('T')[0]} />
              <input name="time" type="time" required className="flex-1 bg-white/50 border-none rounded-lg p-2 text-xs font-bold" defaultValue="12:00" />
            </div>
          </div>
        </div>

        <div className="clean-inset p-6 flex flex-col">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 px-1">Target Communication Pools</label>
          <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-40 pr-2">
            {lists.map(list => (
              <button
                key={list.id}
                type="button"
                onClick={() => setSelectedListIds(prev => prev.includes(list.id) ? prev.filter(i => i !== list.id) : [...prev, list.id])}
                className={`flex items-center justify-between p-3 rounded-xl transition-all border ${
                  selectedListIds.includes(list.id) ? "bg-blue-600 border-blue-600 text-white shadow-md scale-[1.02]" : "bg-white border-slate-100 text-slate-500 hover:border-blue-200"
                }`}
              >
                <span className="text-[10px] font-black uppercase">{list.name}</span>
                {selectedListIds.includes(list.id) && <CheckCircle2 size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <StatusMessage message={status} />

      <button type="submit" disabled={loading} className="w-full clean-button py-5 text-xs uppercase tracking-[0.3em] shadow-lg shadow-blue-200">
        {loading ? "Transmitting Request..." : "Commit Broadcast Schedule"}
      </button>
    </form>
  );
}
