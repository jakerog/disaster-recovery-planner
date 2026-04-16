"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StatusMessage from "@/components/ui/StatusMessage";

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
        setStatus("Email list created successfully");
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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 mb-10 text-gray-900">
      <h2 className="text-lg font-bold uppercase tracking-tight">Create New Recipient List</h2>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">List Name</label>
        <input name="name" required className="w-full border border-gray-200 rounded-lg p-2 text-sm" placeholder="e.g. IT Leadership" />
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Emails (comma separated)</label>
        <textarea name="emails" required className="w-full border border-gray-200 rounded-lg p-2 text-sm" placeholder="user1@company.com, user2@company.com"></textarea>
      </div>
      <StatusMessage message={status} />
      <button type="submit" disabled={loading} className="w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all disabled:opacity-50 uppercase tracking-widest text-[10px]">
        {loading ? "Creating..." : "Save List"}
      </button>
    </form>
  );
}
