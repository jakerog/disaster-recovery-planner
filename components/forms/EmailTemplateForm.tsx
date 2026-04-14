"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EmailTemplateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
        alert("Template created successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 mb-10">
      <h2 className="text-lg font-bold">Create New Template</h2>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Name</label>
        <input name="name" required className="w-full border border-gray-200 rounded-lg p-2 text-sm" placeholder="Template Name" />
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Subject</label>
        <input name="subject" required className="w-full border border-gray-200 rounded-lg p-2 text-sm" placeholder="Email Subject" />
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Body</label>
        <textarea name="body" required className="w-full border border-gray-200 rounded-lg p-2 text-sm min-h-[100px]" placeholder="Recovery instructions..."></textarea>
      </div>
      <button type="submit" disabled={loading} className="w-full py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all disabled:opacity-50">
        {loading ? "Creating..." : "Save Template"}
      </button>
    </form>
  );
}
