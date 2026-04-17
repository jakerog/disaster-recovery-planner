import { prisma } from "@/lib/prisma";
import EmailListForm from "@/components/forms/EmailListForm";
import { Users, Plus, Mail, Shield, Trash2, Globe } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export const dynamic = "force-dynamic";

export default async function EmailListsPage() {
  const lists = await prisma.emailList.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto min-h-screen pb-32">
      <div className="mb-6"><BackButton /></div>
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-600 rounded-xl text-white">
            <Globe size={24} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Communication Pools</h1>
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Strategic Resource Group Definitions</p>
      </header>

      <EmailListForm />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lists.map((list) => {
          const emailCount = list.emails.split(',').filter(Boolean).length;
          return (
            <div key={list.id} className="clean-card p-8 group animate-slide-up flex flex-col shadow-xl shadow-slate-200/50">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-inner">
                  <Users size={28} />
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="status-pill status-pill-green">Verified</span>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{new Date(list.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{list.name}</h3>

              <div className="space-y-4 flex-1">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pool Composition</p>
                    <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-blue-100">{emailCount} NODES</span>
                 </div>
                 <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {list.emails.split(',').map((email, i) => (
                      <div key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                        <Mail size={12} className="text-slate-300" />
                        <span className="truncate">{email.trim()}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex gap-4">
                 <button className="flex-1 clean-button-secondary py-2 text-[10px] uppercase tracking-widest">Update Nodes</button>
                 <button className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-colors">
                    <Trash2 size={16} />
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
