import { prisma } from "@/lib/prisma";
import AvailabilityForm from "@/components/forms/AvailabilityForm";

export default async function AvailabilityPage() {
  const phases = await prisma.phase.findMany({ include: { exercise: true } });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl font-black mb-2 tracking-tighter text-gray-900">Availability Check-in</h1>
        <p className="text-gray-500 mb-10 font-medium italic">Validate your presence for upcoming DR phases.</p>
        <AvailabilityForm phases={phases} />
      </div>
    </div>
  );
}
