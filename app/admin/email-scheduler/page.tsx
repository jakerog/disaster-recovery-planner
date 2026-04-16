import { prisma } from "@/lib/prisma";
import EmailSchedulerClient from "@/components/execution/EmailSchedulerClient";

export default async function EmailSchedulerPage() {
  const schedules = await prisma.emailSchedule.findMany({
    include: { template: true, lists: true },
    orderBy: { scheduledAt: 'desc' }
  });

  return <EmailSchedulerClient schedules={schedules as any} />;
}
