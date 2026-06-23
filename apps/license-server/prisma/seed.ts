import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password', 10);
  await prisma.user.upsert({
    where: { email: 'admin@license.edzero.test' },
    update: {},
    create: {
      name: 'License Admin',
      email: 'admin@license.edzero.test',
      password: passwordHash,
    },
  });

  console.log('License server seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
