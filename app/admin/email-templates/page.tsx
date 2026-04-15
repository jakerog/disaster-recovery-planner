import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Mail, Plus, Users, Layout, Send, Calendar } from "lucide-react";

export default async function EmailTemplatesPage() {
  const templates = await prisma.emailTemplate.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Communication Assets</h1>
          <p className="text-sm text-slate-500 font-medium">Standardized recovery notification protocols</p>
        </div>
        <button className="clean-button">
          <Plus size={20} />
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
             <Layout size={14} /> Global Templates
          </h2>
          {templates.map((t) => (
            <div key={t.id} className="clean-card p-6 group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                  <Mail size={20} />
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Ready for Broadcast
                </div>
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{t.name}</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">Subject: {t.subject}</p>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 italic text-xs text-slate-400 line-clamp-3 mb-6">
                {t.body}
              </div>
              <div className="flex gap-3">
                <button className="flex-1 clean-button text-[10px] py-2">Edit Protocol</button>
                <button className="flex-1 clean-button-secondary text-[10px] py-2">Preview</button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
             <Users size={14} /> Transmission Vectors
          </h2>
          <div className="clean-card p-8 bg-blue-600 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Broadcast Intelligence</h3>
              <p className="text-sm text-blue-100 font-medium mb-8">Schedule automated recovery alerts across all resource pools.</p>
              <Link href="/admin/email-scheduler" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-50 transition-all">
                <Send size={16} /> Command Broadcast
              </Link>
            </div>
            <Mail className="absolute -bottom-10 -right-10 text-white opacity-10" size={200} />
          </div>
        </div>
      </div>
    </div>
  );
}
