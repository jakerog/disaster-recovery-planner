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
      phases: {
        include: {
          events: {
            include: {
              stages: {
                include: {
                  tasks: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!exercise) notFound();

  return (
    <div className="min-h-screen bg-gray-100 p-8 lg:p-16 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-12 flex items-center justify-between">
          <Link href="/admin/exercises" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            <ArrowLeft size={14}/> Back to Command Center
          </Link>
          <button className="flex items-center gap-2 skeuo-card border-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
            <Download size={14}/> Export Technical Dossier
          </button>
        </nav>

        <header className="mb-24 px-4">
          <span className="text-blue-600 text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">Recovery Integrity Analytics</span>
          <h1 className="text-7xl font-black tracking-tighter uppercase leading-none mb-6 text-black">{exercise.name}</h1>
          <div className="flex items-center gap-6">
            <span className="skeuo-button text-white px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">{exercise.status}</span>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              Concluded: {exercise.endDate ? new Date(exercise.endDate).toLocaleDateString() : "Operational Phase"}
            </p>
          </div>
        </header>

        <ExerciseReportSummary exercise={exercise as any} />
      </div>
    </div>
  );
}
