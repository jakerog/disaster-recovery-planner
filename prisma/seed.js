const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  // 1. Resources
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

  const user = await prisma.resource.upsert({
    where: { email: 'user@sentinel.com' },
    update: { password, role: 'User' },
    create: {
      fullName: 'Recovery Engineer',
      email: 'user@sentinel.com',
      password,
      role: 'User',
    }
  })

  // 2. Vendor & Team
  const vendor = await prisma.vendor.create({
    data: { name: 'Sentinel Systems', type: 'Internal', email: 'support@sentinel.com' }
  })
  const team = await prisma.team.create({
    data: { name: 'Infrastructure Ops', vendorId: vendor.id, description: 'Handles core failover.' }
  })

  // 3. Exercise
  const exercise = await prisma.exercise.create({
    data: {
      name: 'Q1 Global Recovery Simulation',
      status: 'In-Progress',
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 7),
      notes: 'Testing multi-region resilience.',
      owners: { connect: { id: admin.id } }
    }
  })

  // 4. Phases & Events
  const phaseNames = ["Mock 1", "Mock 2", "Mock 3", "Production"];
  for (let i = 0; i < phaseNames.length; i++) {
    const phase = await prisma.phase.create({
      data: {
        name: phaseNames[i],
        order: i + 1,
        exerciseId: exercise.id,
      }
    })

    // Events for each phase
    const failoverEvent = await prisma.event.create({
      data: { name: 'Failover', phaseId: phase.id, startDate: new Date() }
    })
    const failbackEvent = await prisma.event.create({
      data: { name: 'Failback', phaseId: phase.id, startDate: new Date(Date.now() + 43200000) }
    })

    // Stages for Failover
    const failoverStages = ["Pre-Failover", "Failover", "Post-Failover", "Failover-Rollback"];
    for (const name of failoverStages) {
      const stage = await prisma.stage.create({
        data: { name, exerciseId: exercise.id, eventId: failoverEvent.id }
      })

      // Sample task for the "Failover" stage
      if (name === "Failover") {
        await prisma.task.create({
          data: {
            taskId: `T-${phase.name.charAt(0)}-${name.charAt(0)}-01`,
            notes: `${phase.name} Primary Site Isolation`,
            status: 'Not-Started',
            estimatedTime: 30,
            exerciseId: exercise.id,
            stageId: stage.id,
            teamId: team.id,
            resources: { connect: { id: user.id } }
          }
        })
      }
    }

    // Stages for Failback
    const failbackStages = ["Pre-Failback", "Failback", "Post-Failback", "Failback-Rollback"];
    for (const name of failbackStages) {
      await prisma.stage.create({
        data: { name, exerciseId: exercise.id, eventId: failbackEvent.id }
      })
    }
  }

  console.log('Advanced Seed Completed')
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect())
