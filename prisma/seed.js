const {
  PrismaClient,
  LogStatus,
  TransactionType,
  TxStatus,
} = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  // 1. Create StoreItems
  // 1. Create Schools (let's say 5)
  const schoolIds = [];
  for (let i = 0; i < 5; i++) {
    const school = await prisma.school.create({
      data: {
        name: `${faker.location.city()} High School`,
        isActive: faker.datatype.boolean(),
        // Do not include adminId!
      },
    });
    schoolIds.push(school.id);
  }

  // 2. Create StoreItems, assigning each to a random school
  const storeItems = [];
  for (let i = 0; i < 10; i++) {
    const schoolId = faker.helpers.arrayElement(schoolIds);
    const item = await prisma.storeItem.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 10, max: 500 }),
        quantity: faker.number.int({ min: 1, max: 100 }),
        schoolId, // <-- required field now
      },
    });
    storeItems.push(item);
  }

  // 3. Create Users and assign them to schools
  // For each school, create one admin user and a few regular users
  for (let i = 0; i < schoolIds.length; i++) {
    const schoolId = schoolIds[i];

    // Create the admin user
    const adminUser = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        walletAddress: faker.finance.ethereumAddress(),
        avatarSeed: faker.string.alpha({ length: 10 }),
        avatarColor: faker.color.rgb(),
        isAdmin: true,
        hasOnboarded: true,
        schoolId,
      },
    });

    // Update the school to set the adminId
    await prisma.school.update({
      where: { id: schoolId },
      data: {
        adminId: adminUser.id,
      },
    });

    // Create some regular users for this school
    for (let j = 0; j < 3; j++) {
      const user = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          walletAddress: faker.finance.ethereumAddress(),
          avatarSeed: faker.string.alpha({ length: 10 }),
          avatarColor: faker.color.rgb(),
          isAdmin: false,
          hasOnboarded: faker.datatype.boolean(),
          schoolId,
        },
      });

      // Create UserPreferences
      await prisma.userPreferences.create({
        data: {
          userId: user.id,
          genrePrefs: Array.from({ length: 3 }, () => faker.lorem.word()),
          reading: Array.from({ length: 2 }, () =>
            faker.lorem.words({ min: 1, max: 3 })
          ),
          favorites: Array.from({ length: 2 }, () => faker.lorem.word()),
          goal: faker.lorem.sentence({ min: 3, max: 8 }),
          darkMode: faker.datatype.boolean(),
        },
      });

      // Create ReadingLogs, Validators, and TokenRewards
      for (let k = 0; k < 2; k++) {
        const readingLog = await prisma.readingLog.create({
          data: {
            userId: user.id,
            title: faker.lorem.sentence({ min: 2, max: 6 }),
            duration: faker.number.int({ min: 5, max: 180 }),
            summary: faker.lorem.sentences({ min: 1, max: 3 }),
            status: faker.helpers.arrayElement([
              LogStatus.PENDING,
              LogStatus.APPROVED,
              LogStatus.REJECTED,
            ]),
            validator: faker.person.fullName(),
            logHash: faker.string.hexadecimal({ length: 64, prefix: "0x" }),
            approvals: faker.number.int({ min: 0, max: 3 }),
            timestamp: faker.date.recent({ days: 30 }),
          },
        });

        // Create TokenReward if status is APPROVED
        if (readingLog.status === LogStatus.APPROVED) {
          await prisma.tokenReward.create({
            data: {
              logId: readingLog.id,
              tokenType: faker.finance.currencyName(),
              tokenValue: faker.number.int({ min: 10, max: 100 }),
              contractTx: faker.string.hexadecimal({
                length: 64,
                prefix: "0x",
              }),
            },
          });
        }
      }

      // Create PurchasedItems
      for (let k = 0; k < 2; k++) {
        const item = faker.helpers.arrayElement(storeItems);
        await prisma.purchasedItem.create({
          data: {
            userId: user.id,
            itemId: item.id,
            txHash: faker.string.hexadecimal({ length: 64, prefix: "0x" }),
            qrCodeUrl: faker.internet.url(),
            acquiredAt: faker.date.recent({ days: 30 }),
          },
        });
      }

      // Create TransactionHistory
      for (let l = 0; l < 3; l++) {
        await prisma.transactionHistory.create({
          data: {
            userId: user.id,
            transactionType: faker.helpers.arrayElement([
              TransactionType.TOKEN_MINT,
              TransactionType.TOKEN_BURN,
              TransactionType.TOKEN_TRANSFER,
              TransactionType.ITEM_PURCHASE,
            ]),
            amount: faker.number.int({ min: 1, max: 500 }),
            tokenAddress: faker.finance.ethereumAddress(),
            transactionHash: faker.string.hexadecimal({
              length: 64,
              prefix: "0x",
            }),
            blockNumber: faker.number.int({ min: 1, max: 1000000 }),
            status: faker.helpers.arrayElement([
              TxStatus.PENDING,
              TxStatus.CONFIRMED,
              TxStatus.FAILED,
            ]),
            timestamp: faker.date.recent({ days: 30 }),
          },
        });
      }
    }
  }

  console.log("🌱 Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
