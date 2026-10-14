import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";


async function main() {
  const categories = await Promise.all(
    ["Biology", "Earth Science", "Medicine", "Computer Science", "Physics", "Psychology", "Environmental Science", "Engineering"].map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
      })
    )
  );

  const password = await bcrypt.hash("password123", 10);
  const kaliza = await prisma.user.upsert({
    where: { email: "kaliza@tour.dev" },
    update: { hashedPassword: password, role: "STUDENT" },
    create: {
      name: "Kaliza E.",
      email: "kaliza@tour.dev",
      hashedPassword: password,
      bio: "Aspiring marine biologist. Curious about cephalopods.",
      researchInterests: ["marine biology", "evolution"],
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@tour.dev" },
    update: { hashedPassword: password, role: "ADMIN" },
    create: {
      name: "TOUR Admin",
      email: "admin@tour.dev",
      hashedPassword: password,
      role: "ADMIN",
      bio: "TOUR research review administrator.",
      researchInterests: ["Student research", "Publishing"],
    },
  });

  const reviewer = await prisma.user.upsert({
    where: { email: "reviewer@tour.dev" },
    update: { hashedPassword: password, role: "REVIEWER" },
    create: {
      name: "TOUR Reviewer",
      email: "reviewer@tour.dev",
      hashedPassword: password,
      role: "REVIEWER",
      bio: "TOUR research reviewer.",
      researchInterests: ["Research quality", "Academic writing"],
    },
  });

  const stemCat = categories.find((c) => c.name === "Biology") || categories[0];

  const question = await prisma.question.upsert({
    where: { id: "seed-q-stem-1" },
    update: {},
    create: {
      id: "seed-q-stem-1",
      title: "How do microplastics influence soil microbial biodiversity in urban agriculture?",
      description:
        "With rising plastic degradation in topsoil, how does particulate accumulation affect nitrogen fixation and fungal-bacterial ratios in community gardens?",
      categoryId: stemCat.id,
      authorId: admin.id,
      tags: ["STEM", "microbiome", "agriculture", "soil-science"],
      status: "OPEN",
    },
  });

  console.log("Seeded:", {
    categories: categories.length,
    student: `${kaliza.email} / password123`,
    admin: `${admin.email} / password123`,
    reviewer: `${reviewer.email} / password123`,
    question: question.title,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
