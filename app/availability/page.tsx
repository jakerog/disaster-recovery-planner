import { prisma } from "@/lib/prisma";

export default async function AvailabilityPage() {
  const phases = await prisma.phase.findMany({ include: { exercise: true } });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl font-black mb-2 tracking-tighter">Availability Check-in</h1>
        <p className="text-gray-500 mb-10 font-medium italic">Validate your presence for upcoming DR phases.</p>

        <form className="space-y-8">
          {phases.map(phase => (
            <div key={phase.id} className="p-6 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase mb-1 inline-block">
                  {phase.exercise.name}
                </span>
                <h3 className="text-lg font-bold text-gray-900">{phase.name}</h3>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-green-500 transition-colors">
                  <input type="radio" name={`phase-${phase.id}`} value="yes" className="accent-green-600" />
                  <span className="text-sm font-bold text-gray-700">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-red-500 transition-colors">
                  <input type="radio" name={`phase-${phase.id}`} value="no" className="accent-red-600" />
                  <span className="text-sm font-bold text-gray-700">Unavailable</span>
                </label>
              </div>
            </div>
          ))}

          <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200">
            Confirm Availability
          </button>
        </form>
      </div>
    </div>
  );
}
