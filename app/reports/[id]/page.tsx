import { prisma } from "@/lib/prisma";
import ExerciseReportSummary from "@/components/reports/ExerciseReportSummary";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

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

  if (!exercise) notFound();

  return (
    <div className="min-h-screen bg-white p-8 lg:p-16 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-12 flex items-center justify-between">
          <Link href="/admin/exercises" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            <ArrowLeft size={14}/> Back to Command Center
          </Link>
          <button className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
            <Download size={14}/> Generate Executive PDF
          </button>
        </nav>

        <header className="mb-20 border-b border-gray-100 pb-12">
          <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Post-Exercise Analytics</span>
          <h1 className="text-6xl font-black tracking-tighter uppercase leading-none mb-4">{exercise.name}</h1>
          <div className="flex items-center gap-6">
            <span className="px-4 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded">{exercise.status}</span>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              Concluded: {exercise.endDate ? new Date(exercise.endDate).toLocaleDateString() : "Pending"}
            </p>
          </div>
        </header>

        <ExerciseReportSummary exercise={exercise as any} />
      </div>
    </div>
  );
}
