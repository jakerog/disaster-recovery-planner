"use client";

import { Send, Clock, CheckCircle2, Calendar, Shield, Zap } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusMessage from "@/components/ui/StatusMessage";

export default function EmailSchedulerClient({ schedules: initialSchedules }: { schedules: any[] }) {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleProcess = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/email-schedule", { method: "PATCH" });
      const result = await res.json();
      if (res.ok) {
        setStatus(result.count > 0 ? `Dispatched ${result.count} transmissions` : "No pending transmissions found");
        router.refresh();
        // Optimistic update would be better but refresh is safer for demo
      }
    } catch (err) {
      setStatus("Protocol Failure");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Transmission Command</h1>
          <p className="text-sm text-slate-500 font-medium">Coordinate recovery notifications</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleProcess}
            disabled={loading}
            className="clean-button-secondary !border-blue-200 !text-blue-600 flex items-center gap-2"
          >
            <Zap size={18} className={loading ? "animate-pulse" : ""} />
            {loading ? "Processing..." : "Dispatch Pending"}
          </button>
          <button className="clean-button flex items-center gap-2">
            <Send size={18} />
            New Broadcast
          </button>
        </div>
      </div>

      <StatusMessage message={status} />

      <div className="clean-card overflow-hidden rounded-[2rem]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
             <Calendar size={18} className="text-blue-600" /> Operational Schedule
           </h2>
           <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Dispatched
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> Pending
              </div>
           </div>
        </div>

        <div className="divide-y divide-slate-100">
          {schedules.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Transmissions Logged</p>
            </div>
          ) : (
            schedules.map((schedule) => (
              <div key={schedule.id} className="p-8 hover:bg-slate-50 transition-colors group">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-2xl ${schedule.status === 'Sent' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {schedule.status === 'Sent' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-slate-900 text-lg">{schedule.template.name}</h3>
                        <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          schedule.status === 'Sent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {schedule.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-500 mb-3">Transmission to: {schedule.lists.map((l: any) => l.name).join(', ')}</p>
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                         <span className="flex items-center gap-1.5"><Calendar size={12}/> {format(new Date(schedule.scheduledAt), 'MMM d, yyyy @ HH:mm')}</span>
                         <span className="flex items-center gap-1.5"><Shield size={12}/> Protocol Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="clean-button-secondary text-[10px]">Modify</button>
                    <button className="clean-button text-[10px]">Force Send</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
