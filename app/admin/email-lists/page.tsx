"use client";

import { EmailList } from "@prisma/client";
import EmailListForm from "@/components/forms/EmailListForm";
import { useState, useEffect } from "react";

export default function EmailListsPage() {
  const [lists, setLists] = useState<EmailList[]>([]);

  const fetchData = async () => {
    const res = await fetch("/api/email-lists").then(r => r.json());
    setLists(res);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/email-lists?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-8 uppercase">Recipient Management</h1>

        <EmailListForm />

        <div className="grid gap-6">
          {lists.map(list => (
            <div key={list.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center justify-between group hover:border-black transition-all">
              <div>
                <h2 className="text-lg font-bold mb-2 uppercase tracking-tight">{list.name}</h2>
                <p className="text-sm text-gray-500 truncate italic">{list.emails}</p>
              </div>
              <div className="flex gap-3">
                <button className="text-xs font-bold text-gray-400 hover:text-black">Edit</button>
                <button onClick={() => handleDelete(list.id)} className="text-xs font-bold text-red-300 hover:text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
