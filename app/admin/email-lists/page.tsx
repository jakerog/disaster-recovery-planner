import { prisma } from "@/lib/prisma";

export default async function EmailListsPage() {
  const lists = await prisma.emailList.findMany();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Email Recipient Lists</h1>
          <button className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold">Create List</button>
        </div>

        <div className="grid gap-6">
          {lists.map(list => (
            <div key={list.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-bold mb-2">{list.name}</h2>
              <p className="text-sm text-gray-500 mb-4 truncate italic">{list.emails}</p>
              <div className="flex gap-3">
                <button className="text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded border border-gray-200">Edit Recipients</button>
                <button className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded border border-red-100">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
