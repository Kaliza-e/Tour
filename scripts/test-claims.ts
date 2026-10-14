import fs from "fs";
import path from "path";

// 1. Manually load environment variables from .env
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  for (const line of envConfig.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...vals] = trimmed.split("=");
      let val = vals.join("=").trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      process.env[key.trim()] = val;
    }
  }
}

import { prisma } from "../lib/prisma";
import { buildSubmissionCode } from "../lib/submission";

// Core claim execution mirroring the atomic Serializable transaction
async function executeClaim(questionId: string, userId: string) {
  try {
    return await prisma.$transaction(
      async (tx) => {
        const question = await tx.question.findUnique({
          where: { id: questionId },
          include: {
            category: true,
            claims: {
              where: { status: "ACTIVE" },
            },
          },
        });

        if (!question) {
          return { error: "Question not found", status: 404 };
        }

        if (question.status === "RESEARCH_COMPLETED") {
          return {
            error: "This research question has already been completed.",
            status: 400,
          };
        }

        const existingClaimForUser = question.claims.find((c) => c.userId === userId);
        if (existingClaimForUser) {
          return {
            error: "You have already claimed this question.",
            status: 400,
            claim: existingClaimForUser,
          };
        }

        const userActiveClaimsCount = await tx.questionClaim.count({
          where: {
            userId,
            status: "ACTIVE",
          },
        });

        if (userActiveClaimsCount >= 2) {
          return {
            error:
              "You can hold at most 2 active research claims at the same time. Please complete or release an existing claim before adopting a new question.",
            status: 400,
          };
        }

        const activeClaimsCount = question.claims.length;
        if (activeClaimsCount >= 3) {
          const suggestedQuestions = await tx.question.findMany({
            where: {
              categoryId: question.categoryId,
              id: { not: questionId },
              status: "OPEN",
              moderationStatus: { in: ["APPROVED", "approved"] },
            },
            take: 3,
            select: {
              id: true,
              title: true,
              category: { select: { name: true } },
            },
          });

          return {
            error: "This question already has 3 researchers. Explore another question!",
            status: 400,
            isFull: true,
            suggestedQuestions,
          };
        }

        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { name: true, email: true, school: true, location: true },
        });

        const notebookDraft = await tx.submission.create({
          data: {
            submissionId: buildSubmissionCode(),
            userId,
            title: question.title,
            abstract: question.description || `Draft for: ${question.title}`,
            category: question.category.name,
            questionId: question.id,
            questionTitle: question.title,
            status: "DRAFT",
            isTermsAccepted: true,
            email: user?.email || "",
            institution: user?.school || null,
            country: user?.location || null,
          },
        });

        const claim = await tx.questionClaim.upsert({
          where: {
            questionId_userId: {
              questionId: question.id,
              userId,
            },
          },
          update: {
            status: "ACTIVE",
            notebookId: notebookDraft.id,
            releasedAt: null,
            updatedAt: new Date(),
          },
          create: {
            questionId: question.id,
            userId,
            status: "ACTIVE",
            notebookId: notebookDraft.id,
          },
        });

        const newActiveCount = activeClaimsCount + 1;
        await tx.question.update({
          where: { id: question.id },
          data: {
            status: "BEING_RESEARCHED",
          },
        });

        return {
          success: true,
          status: 200,
          claim,
          notebookId: notebookDraft.id,
          spotsLeft: Math.max(0, 3 - newActiveCount),
        };
      },
      {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: "Serializable",
      }
    );
  } catch (error: any) {
    if (error?.code === "P2034") {
      const activeCount = await prisma.questionClaim.count({
        where: { questionId, status: "ACTIVE" },
      });
      if (activeCount >= 3) {
        const q = await prisma.question.findUnique({
          where: { id: questionId },
          select: { categoryId: true },
        });
        const suggestedQuestions = await prisma.question.findMany({
          where: {
            categoryId: q?.categoryId,
            id: { not: questionId },
            status: "OPEN",
            moderationStatus: { in: ["APPROVED", "approved"] },
          },
          take: 3,
          select: {
            id: true,
            title: true,
            category: { select: { name: true } },
          },
        });
        return {
          error: "This question already has 3 researchers. Explore another question!",
          status: 400,
          isFull: true,
          suggestedQuestions,
        };
      }
    }
    throw error;
  }
}

// Core release execution
async function executeRelease(questionId: string, userId: string) {
  return await prisma.$transaction(async (tx) => {
    const claim = await tx.questionClaim.findUnique({
      where: {
        questionId_userId: {
          questionId,
          userId,
        },
      },
    });

    if (!claim || claim.status !== "ACTIVE") {
      return {
        error: "You do not have an active claim for this question.",
        status: 400,
      };
    }

    const updatedClaim = await tx.questionClaim.update({
      where: { id: claim.id },
      data: {
        status: "RELEASED",
        releasedAt: new Date(),
      },
    });

    const remainingActiveClaims = await tx.questionClaim.count({
      where: {
        questionId,
        status: "ACTIVE",
      },
    });

    const question = await tx.question.findUnique({
      where: { id: questionId },
      select: { status: true },
    });

    if (remainingActiveClaims === 0 && question?.status === "BEING_RESEARCHED") {
      await tx.question.update({
        where: { id: questionId },
        data: { status: "OPEN" },
      });
    }

    return {
      success: true,
      status: 200,
      claim: updatedClaim,
      spotsLeft: Math.max(0, 3 - remainingActiveClaims),
    };
  });
}

async function runTests() {
  console.log("=================================================");
  console.log("STARTING TOUR CLAIMS & RESEARCH ADOPTION TESTS");
  console.log("=================================================\n");

  try {
    // Setup test users
    const userEmails = [
      "claim-tester-1@tour.dev",
      "claim-tester-2@tour.dev",
      "claim-tester-3@tour.dev",
      "claim-tester-4@tour.dev",
      "claim-tester-5@tour.dev",
    ];

    const users = await Promise.all(
      userEmails.map((email, idx) =>
        prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            name: `Researcher Test ${idx + 1}`,
            email,
            role: "STUDENT",
            hashedPassword: "testpassword",
          },
        })
      )
    );

    const [u1, u2, u3, u4, u5] = users;

    // Get or create category
    let category = await prisma.category.findFirst({ where: { name: "Computer Science" } });
    if (!category) {
      category = await prisma.category.create({
        data: { name: "Computer Science", slug: "computer-science" },
      });
    }

    // Create 3 open questions for testing
    const q1 = await prisma.question.upsert({
      where: { id: "test-q-claim-1" },
      update: { status: "OPEN", moderationStatus: "APPROVED" },
      create: {
        id: "test-q-claim-1",
        title: "How can zero-knowledge proofs improve student academic credential verification?",
        description: "Exploring cryptographic verification of diplomas and transcripts.",
        authorId: u1.id,
        categoryId: category.id,
        status: "OPEN",
        moderationStatus: "APPROVED",
      },
    });

    const q2 = await prisma.question.upsert({
      where: { id: "test-q-claim-2" },
      update: { status: "OPEN", moderationStatus: "APPROVED" },
      create: {
        id: "test-q-claim-2",
        title: "Can decentralized physical infrastructure (DePIN) support affordable campus mesh networks?",
        description: "Studying IoT and community-driven wifi access.",
        authorId: u1.id,
        categoryId: category.id,
        status: "OPEN",
        moderationStatus: "APPROVED",
      },
    });

    const q3 = await prisma.question.upsert({
      where: { id: "test-q-claim-3" },
      update: { status: "OPEN", moderationStatus: "APPROVED" },
      create: {
        id: "test-q-claim-3",
        title: "What are the latency tradeoffs of on-device neural model compression?",
        description: "Evaluating quantized LLMs running locally on consumer hardware.",
        authorId: u1.id,
        categoryId: category.id,
        status: "OPEN",
        moderationStatus: "APPROVED",
      },
    });

    // Clean up any existing claims and submissions for these test questions and users
    await prisma.questionClaim.deleteMany({
      where: {
        OR: [
          { questionId: { in: [q1.id, q2.id, q3.id] } },
          { userId: { in: users.map((u) => u.id) } },
        ],
      },
    });

    await prisma.submission.deleteMany({
      where: {
        questionId: { in: [q1.id, q2.id, q3.id] },
      },
    });

    console.log("Test fixtures initialized successfully.\n");

    // -------------------------------------------------------------
    // TEST 1: Claiming an open question succeeds and creates notebook draft
    // -------------------------------------------------------------
    console.log("--- TEST 1: Claiming an open question ---");
    const res1 = await executeClaim(q1.id, u1.id);
    if (!res1.success || res1.spotsLeft !== 2) {
      throw new Error(`Test 1 Failed: Expected spotsLeft = 2, got ${JSON.stringify(res1)}`);
    }
    const draftCheck = await prisma.submission.findUnique({
      where: { id: res1.notebookId },
    });
    if (!draftCheck || draftCheck.questionId !== q1.id) {
      throw new Error("Test 1 Failed: Notebook draft not properly created or linked to question");
    }
    console.log("✓ TEST 1 PASSED: Claim succeeded, spotsLeft = 2, notebook draft created.\n");

    // -------------------------------------------------------------
    // TEST 2: Duplicate claim by same user rejected
    // -------------------------------------------------------------
    console.log("--- TEST 2: Duplicate claim rejection ---");
    const res2 = await executeClaim(q1.id, u1.id);
    if (res2.status !== 400 || res2.error !== "You have already claimed this question.") {
      throw new Error(`Test 2 Failed: Expected duplicate claim error, got ${JSON.stringify(res2)}`);
    }
    console.log("✓ TEST 2 PASSED: Duplicate claim rejected with proper message.\n");

    // -------------------------------------------------------------
    // TEST 3: 2-active-claims-per-user limit enforced
    // -------------------------------------------------------------
    console.log("--- TEST 3: 2-active-claims-per-user limit ---");
    // User 1 claims a 2nd question (q2)
    const res3a = await executeClaim(q2.id, u1.id);
    if (!res3a.success) {
      throw new Error(`Test 3a Failed: Claiming 2nd question failed: ${JSON.stringify(res3a)}`);
    }
    // User 1 attempts to claim a 3rd question (q3)
    const res3b = await executeClaim(q3.id, u1.id);
    if (res3b.status !== 400 || !res3b.error?.includes("at most 2 active research claims")) {
      throw new Error(
        `Test 3b Failed: User exceeded limit but was not blocked. Response: ${JSON.stringify(res3b)}`
      );
    }
    console.log("✓ TEST 3 PASSED: User successfully blocked from holding more than 2 active claims.\n");

    // -------------------------------------------------------------
    // TEST 4: Release claim frees spot immediately & resets question status
    // -------------------------------------------------------------
    console.log("--- TEST 4: Release claim frees spot ---");
    const res4 = await executeRelease(q2.id, u1.id);
    if (!res4.success || res4.spotsLeft !== 3) {
      throw new Error(`Test 4 Failed: Expected spotsLeft = 3, got ${JSON.stringify(res4)}`);
    }
    const q2Updated = await prisma.question.findUnique({ where: { id: q2.id } });
    if (q2Updated?.status !== "OPEN") {
      throw new Error(`Test 4 Failed: Expected question status OPEN, got ${q2Updated?.status}`);
    }
    // Now User 1 only has 1 active claim, so User 1 can now claim q3
    const res4b = await executeClaim(q3.id, u1.id);
    if (!res4b.success) {
      throw new Error(`Test 4b Failed: Claim after release should succeed: ${JSON.stringify(res4b)}`);
    }
    console.log("✓ TEST 4 PASSED: Claim released, spot freed to 3, status reverted to OPEN, user claim freed.\n");

    // -------------------------------------------------------------
    // TEST 5: 4th claim rejected with exact copy and suggested questions
    // -------------------------------------------------------------
    console.log("--- TEST 5: 4th claim rejected with suggestions ---");
    // q1 currently has 1 active claim (u1). Fill remaining 2 spots with u2 and u3.
    const res5a = await executeClaim(q1.id, u2.id);
    if (!res5a.success || res5a.spotsLeft !== 1) {
      throw new Error(`Test 5a Failed: User 2 claim failed: ${JSON.stringify(res5a)}`);
    }
    const res5b = await executeClaim(q1.id, u3.id);
    if (!res5b.success || res5b.spotsLeft !== 0) {
      throw new Error(`Test 5b Failed: User 3 claim failed: ${JSON.stringify(res5b)}`);
    }

    // Now attempt 4th claim by u4 on q1
    const res5c = await executeClaim(q1.id, u4.id);
    const expectedError = "This question already has 3 researchers. Explore another question!";
    if (res5c.status !== 400 || res5c.error !== expectedError) {
      throw new Error(
        `Test 5c Failed: Expected exact message '${expectedError}', got '${res5c.error}'`
      );
    }
    if (!Array.isArray(res5c.suggestedQuestions) || res5c.suggestedQuestions.length === 0) {
      throw new Error("Test 5c Failed: Suggested questions were not returned for full question");
    }
    console.log(`✓ TEST 5 PASSED: 4th claim rejected with "${expectedError}" and returned ${res5c.suggestedQuestions.length} suggestions.\n`);

    // -------------------------------------------------------------
    // TEST 6: Concurrency test on the final spot
    // -------------------------------------------------------------
    console.log("--- TEST 6: Concurrency race condition test ---");
    // q2 currently has 0 active claims. Let's fill 2 spots on q2 so exactly 1 spot remains.
    await executeClaim(q2.id, u2.id);
    await executeClaim(q2.id, u3.id);

    const q2BeforeRace = await prisma.questionClaim.count({
      where: { questionId: q2.id, status: "ACTIVE" },
    });
    if (q2BeforeRace !== 2) {
      throw new Error(`Pre-race check failed: expected 2 claims, found ${q2BeforeRace}`);
    }

    // Launch simultaneous claims by u4 and u5 for the last remaining spot on q2
    console.log("Simulating simultaneous claims from User 4 and User 5 for spot 3 of 3...");
    const raceResults = await Promise.allSettled([
      executeClaim(q2.id, u4.id),
      executeClaim(q2.id, u5.id),
    ]);

    const successes = raceResults.filter(
      (r) => r.status === "fulfilled" && (r.value as any)?.success
    );
    const rejections = raceResults.filter(
      (r) =>
        r.status === "fulfilled" &&
        !(r.value as any)?.success &&
        (r.value as any)?.error?.includes("already has 3 researchers")
    );

    const finalActiveClaims = await prisma.questionClaim.count({
      where: { questionId: q2.id, status: "ACTIVE" },
    });

    if (finalActiveClaims !== 3) {
      throw new Error(`Race condition check failed: expected exactly 3 claims, found ${finalActiveClaims}`);
    }

    if (successes.length !== 1 || rejections.length !== 1) {
      console.log("Race result states:", JSON.stringify(raceResults, null, 2));
      throw new Error(
        `Race condition check failed: expected exactly 1 success and 1 rejection, got ${successes.length} successes and ${rejections.length} rejections`
      );
    }

    console.log("✓ TEST 6 PASSED: Concurrency handled safely. Exactly 1 user claimed the final spot, 1 was rejected.\n");

    // Clean up test data
    console.log("Cleaning up test claims and submissions...");
    await prisma.questionClaim.deleteMany({
      where: { questionId: { in: [q1.id, q2.id, q3.id] } },
    });
    await prisma.submission.deleteMany({
      where: { questionId: { in: [q1.id, q2.id, q3.id] } },
    });
    await prisma.question.deleteMany({
      where: { id: { in: [q1.id, q2.id, q3.id] } },
    });
    await prisma.user.deleteMany({
      where: { email: { in: userEmails } },
    });

    console.log("=================================================");
    console.log("ALL 6 CLAIMS & CONCURRENCY TESTS PASSED!");
    console.log("=================================================");
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
