import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.availability.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.stage.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.phase.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.emailList.deleteMany({});
  await prisma.emailTemplate.deleteMany({});

  const exercise = await prisma.exercise.create({
    data: {
      name: "Global Data Center Switch - Q2 2026",
      startDate: new Date("2026-05-15T08:00:00Z"),
      endDate: new Date("2026-05-16T20:00:00Z"),
      status: "Planned",
      notes: "Annual full data center failover exercise.",
    },
  });

  const internalVendor = await prisma.vendor.create({
    data: { name: "IT Infrastructure Core", type: "Internal", exerciseId: exercise.id },
  });

  const dbTeam = await prisma.team.create({
    data: { name: "Database Recovery Team", vendorId: internalVendor.id, exerciseId: exercise.id },
  });

  const res = await prisma.resource.create({
    data: { fullName: "Jules Admin", email: "admin@sentinel.dr", teamId: dbTeam.id, vendorId: internalVendor.id, exerciseId: exercise.id },
  });

  const hashedPassword = await bcrypt.hash("password", 10);
  await prisma.user.create({
    data: { name: "Admin", email: "admin@sentinel.dr", password: hashedPassword, role: "Admin", resourceId: res.id },
  });

  const mock1 = await prisma.phase.create({
    data: { name: "Mock 1", order: 1, exerciseId: exercise.id },
  });

  const failoverEvent = await prisma.event.create({
    data: { name: "Failover", phaseId: mock1.id },
  });

  // Stages
  const stages = [
    "Pre-Failover", "Failover", "Post-Failover", "Failover-Rollback",
    "Pre-Failback", "Failback", "Post-Failback", "Failback-Rollback"
  ];

  for (const name of stages) {
    const stage = await prisma.stage.create({
      data: { name, exerciseId: exercise.id, eventId: failoverEvent.id },
    });

    if (name === "Pre-Failover") {
      await prisma.task.create({
        data: {
          taskId: "NY-DB-001",
          notes: "Database Replication Check",
          status: "Completed",
          estimatedTime: 15,
          actualDuration: 12,
          varianceDuration: -3,
          stageId: stage.id,
          teamId: dbTeam.id,
          exerciseId: exercise.id,
        },
      });
    }
  }

  await prisma.emailList.create({ data: { name: "Executive Stakeholders", emails: "exec1@sentinel.dr, exec2@sentinel.dr" } });
  await prisma.emailTemplate.create({ data: { name: "Failover Commencement", subject: "NOTICE: DR Failover has begun", body: "This is to inform all stakeholders that the NYC to Chicago failover has commenced." } });

  console.log("Seed complete.");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
