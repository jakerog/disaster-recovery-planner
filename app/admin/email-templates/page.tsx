"use client";

import { EmailTemplate } from "@prisma/client";
import EmailTemplateForm from "@/components/forms/EmailTemplateForm";
import { useState, useEffect } from "react";

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);

  const fetchData = async () => {
    const res = await fetch("/api/email-templates").then(r => r.json());
    setTemplates(res);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/email-templates?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-8 uppercase">Recovery Communications</h1>

        <EmailTemplateForm />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {templates.map(t => (
            <div key={t.id} className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm flex flex-col group hover:border-black transition-all">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Subject: {t.subject}</span>
              <h2 className="text-xl font-black mb-4 tracking-tighter uppercase">{t.name}</h2>
              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 mb-6 border border-gray-100 flex-grow italic line-clamp-3">
                {t.body}
              </div>
              <div className="flex gap-4">
                <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
