import { prisma } from "@/lib/prisma";
import AvailabilityForm from "@/components/forms/AvailabilityForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CalendarCheck, Shield } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default async function AvailabilityPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [phases, resource, availabilities] = await Promise.all([
    prisma.phase.findMany({
      include: {
        exercise: true,
        events: {
          include: {
            stages: {
              include: {
                tasks: { include: { resources: { include: { team: true } } } },
                availabilities: { include: { resource: { include: { team: true } } } }
              }
            }
          }
        }
      },
      orderBy: { order: "asc" }
    }),
    prisma.resource.findUnique({ where: { email: session.user?.email || "" } }),
    prisma.availability.findMany({
      where: { resource: { email: session.user?.email || "" } }
    })
  ]);

  if (!resource) return <div className="p-8 text-gray-900 font-bold">Error: Resource record not found.</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto clean-card p-8 md:p-16 rounded-[3rem] border border-white">
        <div className="mb-6"><BackButton /></div>
        <header className="flex justify-between items-center mb-16">
           <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center text-white shadow-2xl ring-4 ring-white">
               <CalendarCheck size={32} />
             </div>
             <div>
                <h1 className="text-4xl font-black tracking-tighter text-black uppercase leading-none">Pre-Check</h1>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Recovery Window Validation</p>
             </div>
           </div>
           <div className="text-right hidden sm:block">
             <div className="text-[11px] font-black text-black uppercase tracking-tight">{resource.fullName}</div>
             <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{resource.role}</div>
           </div>
        </header>

        <section className="mb-12 p-8 clean-inset border border-white/70">
           <div className="flex items-center gap-3 mb-4">
             <Shield size={16} className="text-blue-500" />
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">Active Mandate</h2>
           </div>
           <p className="text-base font-bold text-gray-600 leading-relaxed">Identity confirmed. Please validate your participation status for the following recovery cycles. Your response is mandatory for mission-critical resource allocation and failover orchestration.</p>
        </section>

        <AvailabilityForm phases={phases as any} resourceId={resource.id} initialAvailabilities={availabilities} />

        <footer className="mt-16 pt-12 border-t border-gray-50 text-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Sentinel Autonomous Resource Management Protocol</p>
        </footer>
      </div>
    </div>
  );
}
