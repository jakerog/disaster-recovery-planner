"use client";

import { Exercise } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Briefcase, Calendar, Globe, Info, Shield, Activity, Camera } from "lucide-react";
import StatusMessage from "@/components/ui/StatusMessage";

export default function ExerciseForm({ initialData }: { initialData?: Exercise }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [photo, setPhoto] = useState(initialData?.photo || "");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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
          photo,
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
    <div className={`clean-inset p-3 px-5 border border-slate-100 ${checkbox ? "flex items-center gap-4 py-5" : ""}`}>
      {checkbox ? (
        <>
          <input id={name} name={name} type="checkbox" defaultChecked={!!initialData?.[name as keyof Exercise]} className="w-5 h-5 accent-blue-600 cursor-pointer" />
          <label htmlFor={name} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 cursor-pointer">{label}</label>
        </>
      ) : (
        <>
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1 flex items-center gap-2">
            <Icon size={10} /> {label}
          </label>
          <input name={name} type={type} defaultValue={initialData?.[name as keyof Exercise] as any} className="w-full bg-transparent text-sm font-bold focus:outline-none" />
        </>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="clean-card p-10 rounded-[2.5rem] space-y-10 max-w-2xl mx-auto text-slate-900 shadow-xl shadow-slate-200/50">
      <header className="flex justify-between items-center border-b border-slate-50 pb-8">
         <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">{initialData ? "Operational Mandate" : "New Directive"}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Exercise Control Protocol</p>
         </div>
         {photo ? (
           <img src={photo} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50" alt="Logo" />
         ) : (
           <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
              <Shield size={24} />
           </div>
         )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2"><Field label="Exercise Designation" name="name" icon={Globe} /></div>
        <Field label="Commencement Date" name="startDate" type="date" icon={Calendar} />
        <Field label="Termination Date" name="endDate" type="date" icon={Calendar} />

        <div className="clean-inset p-3 px-5 border border-slate-100">
           <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1 flex items-center gap-2">
             <Activity size={10} /> Operational Status
           </label>
           <select name="status" defaultValue={initialData?.status} className="w-full bg-transparent text-sm font-bold focus:outline-none appearance-none cursor-pointer">
             <option>Planned</option><option>In-Progress</option><option>On-Hold</option><option>Completed</option><option>Cancelled</option>
           </select>
        </div>

        <div className="clean-inset p-3 px-5 border border-slate-100 relative group cursor-pointer hover:bg-slate-50 transition-colors">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1 flex items-center gap-2">
            <Camera size={10} /> Exercise Logo
          </label>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-400">{photo ? "Visual ID Set" : "Upload Insignia"}</span>
            <Camera size={14} className="text-blue-600" />
          </div>
          <input type="file" onChange={handleFileUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        <div className="md:col-span-2">
          <Field label="Resource Mock 3 Activation" name="mock3Required" checkbox icon={Info} />
        </div>

        <div className="md:col-span-2">
          <Field label="Operational Notes & Intel" name="notes" icon={Info} />
        </div>
      </div>

      <StatusMessage message={status} />

      <button type="submit" disabled={loading} className="w-full clean-button text-white p-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-lg shadow-blue-200 disabled:opacity-50">
        {loading ? "Deploying Mandate..." : "Initialize Command"}
      </button>
    </form>
  );
}
