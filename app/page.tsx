import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-10 text-center">
        <h1 className="text-4xl font-black mb-4 tracking-tighter">Sentinel</h1>
        <p className="text-gray-500 mb-8 font-medium italic">Disaster Recovery Orchestrator</p>

        <div className="grid gap-4">
          <Link href="/admin/exercises" className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
            Admin Dashboard
          </Link>
          <Link href="/availability" className="w-full py-3 bg-white text-black border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all">
            Resource Check-in
          </Link>
        </div>
      </div>
    </div>
  );
}
