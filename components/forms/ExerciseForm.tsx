"use client";

import { Exercise } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Briefcase, Calendar, Globe, Info, Shield, Activity } from "lucide-react";
import StatusMessage from "@/components/ui/StatusMessage";

export default function ExerciseForm({ initialData }: { initialData?: Exercise }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const method = initialData ? "PATCH" : "POST";
      const body = initialData ? { ...data, id: initialData.id } : data;

      const res = await fetch("/api/exercises", {
        method,
        body: JSON.stringify({
          ...body,
          startDate: data.startDate ? new Date(data.startDate as string) : null,
          endDate: data.endDate ? new Date(data.endDate as string) : null,
          mock3Required: (e.currentTarget.elements.namedItem("mock3Required") as HTMLInputElement).checked
        }),
      });

      if (res.ok) {
        router.refresh();
        setStatus("Mandate Initialized");
        setTimeout(() => setStatus(""), 3000);
      }
    } catch (error) {
      console.error(error);
      setStatus("Operation Failed");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, icon: Icon, type = "text", checkbox = false }: any) => (
    <div className={`clean-inset p-3 px-5 border border-white/50 ${checkbox ? "flex items-center gap-4 py-5" : ""}`}>
      {checkbox ? (
        <>
          <input id={name} name={name} type="checkbox" defaultChecked={!!initialData?.[name as keyof Exercise]} className="w-5 h-5 accent-black cursor-pointer" />
          <label htmlFor={name} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-800 cursor-pointer">{label}</label>
        </>
      ) : (
        <>
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1 flex items-center gap-2">
            <Icon size={10} /> {label}
          </label>
          <input name={name} type={type} defaultValue={initialData?.[name as keyof Exercise] as any} className="w-full bg-transparent text-sm font-bold focus:outline-none" />
        </>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="clean-card p-10 rounded-[2.5rem] space-y-10 max-w-2xl mx-auto text-black">
      <header className="flex justify-between items-center border-b border-gray-100 pb-8">
         <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">{initialData ? "Operational Mandate" : "New Directive"}</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Exercise Control Protocol</p>
         </div>
         <div className="w-16 h-16 rounded-3xl bg-black flex items-center justify-center text-white shadow-xl">
            <Shield size={24} />
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2"><Field label="Exercise Designation" name="name" icon={Globe} /></div>
        <Field label="Commencement Date" name="startDate" type="date" icon={Calendar} />
        <Field label="Termination Date" name="endDate" type="date" icon={Calendar} />

        <div className="clean-inset p-3 px-5 border border-white/50">
           <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1 flex items-center gap-2">
             <Activity size={10} /> Operational Status
           </label>
           <select name="status" defaultValue={initialData?.status} className="w-full bg-transparent text-sm font-bold focus:outline-none appearance-none cursor-pointer">
             <option>Planned</option><option>In-Progress</option><option>On-Hold</option><option>Completed</option><option>Cancelled</option>
           </select>
        </div>

        <Field label="Resource Mock 3 Activation" name="mock3Required" checkbox icon={Info} />

        <div className="md:col-span-2">
          <Field label="Operational Notes & Intel" name="notes" icon={Info} />
        </div>
      </div>

      <StatusMessage message={status} />

      <button type="submit" disabled={loading} className="w-full clean-button text-white p-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] disabled:opacity-50">
        {loading ? "Deploying Mandate..." : "Initialize Command"}
      </button>
    </form>
  );
}
