import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock TestRun and TestResult for AI Analysis...');

  // 1. Get or create a User
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'AI Test User',
        email: 'test@ai.local',
        passwordHash: 'dummy'
      }
    });
  }

  // 2. Get or create a Project
  let project = await prisma.project.findFirst({ where: { userId: user.id } });
  if (!project) {
    project = await prisma.project.create({
      data: {
        name: 'AI Test Project',
        userId: user.id
      }
    });
  }

  // 3. Create a fake Endpoint
  const endpoint = await prisma.endpoint.create({
    data: {
      projectId: project.id,
      method: 'POST',
      path: '/api/v1/orders',
      authRequired: true,
      requestSchema: {
        type: 'object',
        properties: {
          itemId: { type: 'string' },
          quantity: { type: 'number' }
        }
      }
    }
  });

  // 4. Create a fake TestRun
  const testRun = await prisma.testRun.create({
    data: {
      projectId: project.id,
      status: 'COMPLETED',
      totalApis: 1,
      failedCount: 1
    }
  });

  // 5. Create a fake failed TestResult
  const testResult = await prisma.testResult.create({
    data: {
      runId: testRun.id,
      endpointId: endpoint.id,
      success: false,
      statusCode: 500,
      responseTimeMs: 120,
      errorMessage: 'Internal Server Error',
      responseBody: {
        error: 'TypeError: Cannot read property "price" of null',
        stack: 'at OrderController.createOrder (/app/src/controllers/order.js:42:15)'
      }
    }
  });

  console.log(`\nSeed completed successfully!`);
  console.log(`Use this TestRun ID for testing the AI Endpoint: ${testRun.id}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
