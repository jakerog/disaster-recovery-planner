import { prisma } from "@/lib/prisma";
import AvailabilityForm from "@/components/forms/AvailabilityForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AvailabilityPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [phases, resource] = await Promise.all([
    prisma.phase.findMany({ include: { exercise: true } }),
    prisma.resource.findUnique({ where: { email: session.user?.email || "" } })
  ]);

  if (!resource) return <div className="p-8 text-gray-900 font-bold">Error: Resource record not found for your account.</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-10">
        <div className="flex justify-between items-start mb-10">
           <div>
              <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase leading-none">Availability</h1>
              <p className="text-gray-400 font-medium italic mt-2 uppercase text-[10px] tracking-widest">Identity: {resource.fullName}</p>
           </div>
           <div className="w-12 h-12 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center font-black text-gray-400">
             {resource.fullName.charAt(0)}
           </div>
        </div>
        <AvailabilityForm phases={phases} resourceId={resource.id} />
      </div>
    </div>
  );
}
