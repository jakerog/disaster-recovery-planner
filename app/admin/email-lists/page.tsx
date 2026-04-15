import { prisma } from "@/lib/prisma";
import { Users, Plus, Mail, Shield, Trash2 } from "lucide-react";

export default async function EmailListsPage() {
  const lists = await prisma.emailList.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Communication Pools</h1>
          <p className="text-sm text-slate-500 font-medium">Strategic resource group definitions</p>
        </div>
        <button className="clean-button">
          <Plus size={20} />
          New Pool
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map((list) => {
          const emailCount = list.emails.split(',').filter(Boolean).length;
          return (
            <div key={list.id} className="clean-card p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <Users size={24} />
                </div>
                <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">{list.name}</h3>
              <div className="flex items-center gap-2 mb-8">
                <span className="status-pill status-pill-blue">
                   {emailCount} Nodes
                </span>
                <span className="status-pill status-pill-green">Verified</span>
              </div>

              <div className="space-y-3">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pool Composition</p>
                 <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {list.emails.split(',').map((email, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <Mail size={12} className="text-slate-400" />
                        {email.trim()}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          );
        })}

        <div className="clean-card border-dashed border-2 flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-blue-300 transition-all">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 mb-4 transition-all">
            <Plus size={32} />
          </div>
          <h4 className="font-bold text-slate-900">Initialize New Pool</h4>
          <p className="text-xs text-slate-500 mt-2">Aggregate resources for deployment notification</p>
        </div>
      </div>
    </div>
  );
}
