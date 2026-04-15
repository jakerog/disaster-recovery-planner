import { prisma } from "@/lib/prisma";
import AvailabilityForm from "@/components/forms/AvailabilityForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CalendarCheck, Shield } from "lucide-react";

export default async function AvailabilityPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [phases, resource] = await Promise.all([
    prisma.phase.findMany({
      include: { exercise: true },
      orderBy: { order: "asc" }
    }),
    prisma.resource.findUnique({ where: { email: session.user?.email || "" } })
  ]);

  if (!resource) return <div className="p-8 text-gray-900 font-bold">Error: Resource record not found.</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-3xl mx-auto skeuo-card p-8 md:p-12 rounded-[2.5rem]">
        <header className="flex justify-between items-center mb-12">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
               <CalendarCheck size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-tighter text-black uppercase leading-none">Pre-Check</h1>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Resource Availability Portal</p>
             </div>
           </div>
           <div className="text-right">
             <div className="text-[10px] font-black text-black uppercase">{resource.fullName}</div>
             <div className="text-[9px] font-bold text-gray-400 uppercase">{resource.email}</div>
           </div>
        </header>

        <section className="mb-10 p-6 skeuo-inset border border-white">
           <div className="flex items-center gap-2 mb-4">
             <Shield size={14} className="text-blue-500" />
             <h2 className="text-[10px] font-black uppercase tracking-widest text-black">Active Mandate</h2>
           </div>
           <p className="text-sm font-bold text-gray-600">Please validate your participation status for the following recovery phases. Your response determines mission-critical resource allocation.</p>
        </section>

        <AvailabilityForm phases={phases} resourceId={resource.id} />

        <footer className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Sentinel Autonomous Resource Management</p>
        </footer>
      </div>
    </div>
  );
}
