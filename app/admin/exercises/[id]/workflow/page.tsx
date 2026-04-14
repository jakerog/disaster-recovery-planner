import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function WorkflowManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      phases: {
        include: {
          events: {
            include: {
              stages: true
            }
          }
        },
        orderBy: { order: "asc" }
      }
    }
  });

  if (!exercise) notFound();

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-black tracking-tighter uppercase">{exercise.name}</h1>
          <p className="text-gray-500 font-bold italic">Workflow & Life-Cycle Configuration</p>
        </header>

        <div className="space-y-12">
          {exercise.phases.map(phase => (
            <section key={phase.id} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
                <h2 className="text-xl font-black tracking-tight uppercase">Phase: {phase.name}</h2>
                <button className="text-xs font-bold text-gray-400 hover:text-black uppercase">Add Event</button>
              </div>

              <div className="space-y-8">
                {phase.events.map(event => (
                  <div key={event.id} className="ml-6 border-l-2 border-gray-100 pl-6 py-2">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-700 tracking-tight">{event.name} Event</h3>
                      <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">Add Stage</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {event.stages.map(stage => (
                        <div key={stage.id} className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex justify-between items-center group">
                          <span className="text-sm font-bold text-gray-800">{stage.name}</span>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="text-xs font-bold text-gray-400 hover:text-black">Edit</button>
                             <button className="text-xs font-bold text-red-300 hover:text-red-600">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <button className="w-full py-6 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-black uppercase tracking-widest hover:border-black hover:text-black transition-all">
            + Append New Phase
          </button>
        </div>
      </div>
    </div>
  );
}
