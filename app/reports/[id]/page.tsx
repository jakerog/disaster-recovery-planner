import { prisma } from "@/lib/prisma";
import ExerciseReportSummary from "@/components/reports/ExerciseReportSummary";
import GranularAnalytics from "@/components/reports/GranularAnalytics";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Shield } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

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
    <div className="min-h-screen bg-slate-50 p-8 lg:p-16 text-slate-900 font-sans selection:bg-blue-100">
      <div className="max-w-7xl mx-auto">
        <nav className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton />
            <Link href={`/exercise/${id}`} className="clean-button-secondary">
              <ArrowLeft size={16}/> Back to Mission Control
            </Link>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <Shield size={20} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analytics Terminal</p>
                <p className="text-sm font-black text-slate-900">Sentinel Intelligence</p>
             </div>
          </div>
          <button className="clean-button">
            <Download size={16}/> Export Dossier
          </button>
        </nav>

        <header className="mb-20">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Recovery Integrity Analytics</span>
          <h1 className="text-6xl font-black tracking-tight uppercase leading-none mb-6 text-slate-900">{exercise.name}</h1>
          <div className="flex items-center gap-6">
            <span className="bg-blue-600 text-white px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">{exercise.status}</span>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              Concluded: {exercise.endDate ? new Date(exercise.endDate).toLocaleDateString() : "Operational Phase"}
            </p>
          </div>
        </header>

        <ExerciseReportSummary exercise={exercise as any} />

        <GranularAnalytics exercise={exercise as any} />
      </div>

      <footer className="mt-20 pt-8 border-t border-slate-200 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">Sentinel Intelligence Matrix v2.0</p>
      </footer>
    </div>
  );
}
