import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
  const amara = await prisma.user.upsert({
    where: { email: "amara@tour.dev" },
    update: {},
    create: {
      name: "Amara O.",
      email: "amara@tour.dev",
      hashedPassword: password,
      bio: "Aspiring marine biologist. Curious about cephalopods.",
      researchInterests: ["marine biology", "evolution"],
    },
  });

  const biology = categories.find((c) => c.name === "Biology")!;

  const question = await prisma.question.create({
    data: {
      title: "Why do octopuses have three hearts?",
      description:
        "Two hearts pump blood to the gills, one to the rest of the body — but the systemic heart stops when swimming. What's the evolutionary tradeoff?",
      categoryId: biology.id,
      authorId: amara.id,
      tags: ["biology", "evolution", "marine-life"],
    },
  });

  console.log("Seeded:", { categories: categories.length, user: amara.email, question: question.title });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
