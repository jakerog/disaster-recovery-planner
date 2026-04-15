"use client";

import { Resource, Team, Vendor, Exercise } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Mail, Phone, Hash, Shield, Camera } from "lucide-react";

export default function ResourceForm({ initialData, teams = [], vendors = [], exercises = [] }: {
  initialData?: Resource | null,
  teams?: Team[],
  vendors?: Vendor[],
  exercises?: Exercise[]
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const method = initialData ? "PATCH" : "POST";
      const body = initialData ? { ...data, id: initialData.id } : data;
      const res = await fetch("/api/resources", { method, body: JSON.stringify(body) });
      if (res.ok) { router.refresh(); alert("Resource Synchronized"); }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const Field = ({ label, name, icon: Icon, type = "text", options = null }: any) => (
    <div className="clean-inset p-3 px-5 border border-white/50">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1 flex items-center gap-2">
        <Icon size={10} /> {label}
      </label>
      {options ? (
        <select name={name} defaultValue={initialData ? (initialData as any)[name] : ""} className="w-full bg-transparent text-sm font-bold focus:outline-none appearance-none cursor-pointer">
          <option value="">None / Unassigned</option>
          {options.map((o: any) => <option key={o.id} value={o.id}>{o.name || o.fullName}</option>)}
        </select>
      ) : (
        <input name={name} type={type} defaultValue={initialData ? (initialData as any)[name] : ""} className="w-full bg-transparent text-sm font-bold focus:outline-none" />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="clean-card p-10 rounded-[2.5rem] space-y-10 max-w-2xl mx-auto">
      <header className="flex justify-between items-center border-b border-gray-100 pb-8">
         <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-black">{initialData ? "Edit Agent" : "New Agent"}</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Resource Matrix Entry</p>
         </div>
         <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300 clean-inset border-2 border-white">
            <Camera size={24} />
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2"><Field label="Full Identity Name" name="fullName" icon={User} /></div>
        <Field label="Protocol Email" name="email" icon={Mail} type="email" />
        <Field label="Comm Phone" name="phoneNumber" icon={Phone} />
        <Field label="Alt Telephone" name="telephoneNumber" icon={Hash} />
        <Field label="Operational Role" name="role" icon={Shield} />

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
           <Field label="Team Assignment" name="teamId" icon={Shield} options={teams} />
           <Field label="Vendor Affiliation" name="vendorId" icon={Shield} options={vendors} />
           <Field label="Exercise Mandate" name="exerciseId" icon={Shield} options={exercises} />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full clean-button text-white p-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] disabled:opacity-50">
        {loading ? "Synchronizing Matrix..." : "Commit Data Stream"}
      </button>
    </form>
  );
}
