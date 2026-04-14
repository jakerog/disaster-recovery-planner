import { prisma } from "@/lib/prisma";
import ExerciseReportSummary from "@/components/reports/ExerciseReportSummary";

export default async function ExerciseReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const exercise = await prisma.exercise.findUnique({
    where: { id },
    include: {
      stages: {
        include: {
          tasks: true,
        },
      },
    },
  });

  if (!exercise) return <div>Report Not Found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">{exercise.name}</h1>
            <p className="text-gray-500 font-bold italic">After-Action Review Dashboard</p>
          </div>
          <button className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm shadow-xl shadow-gray-200">
            Export PDF
          </button>
        </header>

        <ExerciseReportSummary exercise={exercise as any} />
      </div>
    </div>
  );
}
