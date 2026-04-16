import { prisma } from "@/lib/prisma";
import Link from "next/link";
import EmailTemplateForm from "@/components/forms/EmailTemplateForm";
import { Mail, Plus, Users, Layout, Send, Calendar, ClipboardList, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EmailTemplatesPage() {
  const templates = await prisma.emailTemplate.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto min-h-screen pb-32">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-600 rounded-xl text-white">
            <ClipboardList size={24} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Transmission Protocols</h1>
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Standardized Recovery Notification Assets</p>
      </header>

      <EmailTemplateForm />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3 px-2">
             <Layout size={14} /> Global Assets
          </h2>
          {templates.map((t) => (
            <div key={t.id} className="clean-card p-8 group animate-slide-up shadow-xl shadow-slate-200/50">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
                  <Mail size={24} />
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active Vector</span>
                   <span className="text-[9px] font-bold text-slate-300 uppercase mt-1">{new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2 tracking-tight uppercase">{t.name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Subject: {t.subject}</p>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-500 line-clamp-3 mb-8 leading-relaxed">
                {t.body}
              </div>

              <div className="flex gap-4">
                <button className="flex-1 clean-button-secondary py-2 text-[10px] uppercase tracking-widest">Modify Logic</button>
                <button className="flex-1 clean-button-secondary py-2 text-[10px] uppercase tracking-widest">Dry Run (Preview)</button>
              </div>
            </div>
          ))}
          {templates.length === 0 && (
             <div className="clean-card p-12 text-center border-dashed">
                <p className="text-slate-400 font-bold uppercase tracking-widest">No Protocols Defined</p>
             </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3 px-2">
             <Zap size={14} /> Tactical Operations
          </h2>
          <div className="clean-card p-10 bg-blue-600 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Broadcast Intelligence</h3>
              <p className="text-base font-bold text-blue-100 mb-10 leading-relaxed">Coordinate automated recovery notifications across all active resource nodes and communication pools.</p>
              <Link href="/admin/email-scheduler" className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl">
                <Send size={18} /> Transmission Command
              </Link>
            </div>
            <Mail className="absolute -bottom-10 -right-10 text-white opacity-5" size={300} />
          </div>

          <div className="clean-card p-8 border-dashed border-2 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-300 transition-all">
             <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4 group-hover:text-blue-500 transition-colors">
                <Plus size={24} />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Import External Protocol</p>
          </div>
        </div>
      </div>
    </div>
  );
}
