const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const admin = await prisma.resource.upsert({
    where: { email: 'admin@sentinel.com' },
    update: { password, role: 'Admin' },
    create: {
      fullName: 'Sentinel Admin',
      email: 'admin@sentinel.com',
      password,
      role: 'Admin',
    }
  })

  const vendor = await prisma.vendor.create({
    data: {
      name: 'CloudScale Infrastructure',
      type: 'External',
      email: 'support@cloudscale.io'
    }
  })

  const team = await prisma.team.create({
    data: {
      name: 'Site Reliability Engineering',
      vendorId: vendor.id,
      description: 'Core platform stability and recovery team.'
    }
  })

  const exercise = await prisma.exercise.create({
    data: {
      name: 'Project Sentinel - Core Resilience Mock 1',
      status: 'In-Progress',
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      notes: 'Initial validation of multi-region failover capabilities.',
      owners: { connect: { id: admin.id } }
    }
  })

  const stageNames = ["Pre-Failover", "Failover", "Post-Failover", "Failover-Rollback", "Pre-Failback", "Failback", "Post-Failback", "Failback-Rollback"];
  const stages = [];
  for (const name of stageNames) {
    const s = await prisma.stage.create({
      data: {
        name,
        exerciseId: exercise.id,
      }
    })
    stages.push(s);
  }

  const failoverStage = stages.find(s => s.name === "Failover");
  await prisma.task.create({
    data: {
      taskId: 'DR-101',
      notes: 'Initiate Database Read-Replica Promotion',
      status: 'In-Progress',
      workflow: 'Sequential',
      estimatedTime: 20,
      exerciseId: exercise.id,
      stageId: failoverStage.id,
      teamId: team.id,
      resources: { connect: { id: admin.id } }
    }
  })

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
