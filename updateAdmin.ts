import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: 'admin@shreeshamobile.com' },
    data: { password: '$2b$10$z6PxX4yxzDGrt1SZZ.6OzuxzPPxN8e8sdayn8bRGSCxKmbQIVrqZW' }
  });
  console.log('Password updated successfully');
}
main();
