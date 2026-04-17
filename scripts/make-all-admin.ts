import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Tüm kullanıcıları admin yap
  const result = await prisma.user.updateMany({
    data: { isAdmin: true },
  });

  console.log(`${result.count} kullanıcı admin yapıldı!`);

  // Kullanıcıları listele
  const users = await prisma.user.findMany({
    select: { email: true, name: true, isAdmin: true },
  });

  console.log("\nKullanıcılar:");
  users.forEach((u) => {
    console.log(`- ${u.email} (${u.name}) - Admin: ${u.isAdmin}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
