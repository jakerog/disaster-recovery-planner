import { prisma } from "@/lib/prisma";
import EmailSchedulerClient from "@/components/execution/EmailSchedulerClient";
import EmailScheduleForm from "@/components/forms/EmailScheduleForm";

export default async function EmailSchedulerPage() {
  const [schedules, templates, lists] = await Promise.all([
    prisma.emailSchedule.findMany({
      include: { template: true, lists: true },
      orderBy: { scheduledAt: 'desc' }
    }),
    prisma.emailTemplate.findMany({ orderBy: { name: 'asc' } }),
    prisma.emailList.findMany({ orderBy: { name: 'asc' } })
  ]);

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-7xl mx-auto">
      <EmailScheduleForm templates={templates} lists={lists} />
      <EmailSchedulerClient schedules={schedules as any} />
    </div>
  );
}
