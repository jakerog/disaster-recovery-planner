const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  await prisma.resource.upsert({
    where: { email: 'admin@sentinel.com' },
    update: {},
    create: {
      fullName: 'Sentinel Admin',
      email: 'admin@sentinel.com',
      password,
      role: 'Admin',
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
