"use client";

import { useState, useEffect } from "react";
import { Send, Clock, Calendar, CheckCircle, AlertCircle } from "lucide-react";

export default function EmailSchedulerPage() {
  const [templates, setTemplates] = useState([]);
  const [lists, setLists] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({ templateId: "", listId: "", scheduledAt: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/email-templates").then(res => res.json()).then(setTemplates);
    fetch("/api/email-lists").then(res => res.json()).then(setLists);
    fetch("/api/email-schedule").then(res => res.json()).then(setSchedules);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/email-schedule", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    setFormData({ templateId: "", listId: "", scheduledAt: "" });
    fetch("/api/email-schedule").then(res => res.json()).then(setSchedules);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans text-gray-900">
      <header className="mb-12 border-b pb-8 border-gray-100">
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 block">Orchestration</span>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Email Scheduler</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Create New Delivery</h2>
          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Template</label>
              <select
                value={formData.templateId}
                onChange={e => setFormData({...formData, templateId: e.target.value})}
                className="w-full bg-white border border-gray-200 p-4 rounded-2xl font-bold appearance-none"
                required
              >
                <option value="">Select Template</option>
                {templates.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Target List</label>
              <select
                value={formData.listId}
                onChange={e => setFormData({...formData, listId: e.target.value})}
                className="w-full bg-white border border-gray-200 p-4 rounded-2xl font-bold appearance-none"
                required
              >
                <option value="">Select List</option>
                {lists.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Schedule Time</label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={e => setFormData({...formData, scheduledAt: e.target.value})}
                className="w-full bg-white border border-gray-200 p-4 rounded-2xl font-bold"
                required
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-black text-white p-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
            >
              <Send size={16} /> {loading ? "Queueing..." : "Schedule Delivery"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Scheduled Queues</h2>
          <div className="space-y-4">
            {schedules.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    {s.status === "Pending" ? <Clock size={18}/> : <CheckCircle size={18} className="text-green-500"/>}
                  </div>
                  <div>
                    <div className="text-sm font-black uppercase tracking-tight">Queue ID: {s.id.slice(0,8)}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">{new Date(s.scheduledAt).toLocaleString()}</div>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase bg-gray-50 px-3 py-1 rounded text-gray-400">{s.status}</span>
              </div>
            ))}
            {schedules.length === 0 && <p className="text-sm font-bold text-gray-300 uppercase italic">No pending schedules</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
