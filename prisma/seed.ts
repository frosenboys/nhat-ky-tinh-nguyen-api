import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Tạo studentId 8 số
function randomStudentId() {
  const prefix = 25;
  const random6 = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${random6}`;
}

async function seedUsers() {
  console.log("👤 Seeding Users...");

  const users: Prisma.UserCreateManyInput[] = [];

  for (let i = 0; i < 10; i++) {
    const password = await bcrypt.hash("123456", 10);

    users.push({
      studentId: randomStudentId(),
      password,
      fullName: `Học sinh ${i + 1}`,
      unionGroup: `10A${(i % 5) + 1}`,
      position: "Học sinh",
      avatarUrl: `https://i.pravatar.cc/150?img=${i + 10}`,
      points: Math.floor(Math.random() * 200),
      points_1: Math.floor(Math.random() * 50),
      points_2: Math.floor(Math.random() * 50),
      points_3: Math.floor(Math.random() * 50),
      points_4: Math.floor(Math.random() * 50),
      points_5: Math.floor(Math.random() * 50),
    });
  }

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log("✅ Users seeded");
}

async function seedMissions() {
  console.log("📝 Seeding Missions...");

  const missions = [
    { missionName: "Tham gia chào cờ tuần 1", status: "open", for: "GLOBAL" },
    { missionName: "Sinh hoạt câu lạc bộ", status: "open", for: "GLOBAL" },
    { missionName: "Hoạt động tình nguyện cuối tuần", status: "open", for: "USER" },
    { missionName: "Thực hiện vệ sinh lớp học", status: "open", for: "GLOBAL" },
    { missionName: "Đóng góp quỹ từ thiện", status: "open", for: "GROUP" },
    { missionName: "Tham gia hội thi văn nghệ", status: "closed", for: "GLOBAL" },
  ];

  for (const m of missions) {
    const exists = await prisma.missions.findFirst({
      where: { missionName: m.missionName },
    });

    if (!exists) {
      await prisma.missions.create({ data: m });
    }
  }

  console.log("✅ Missions seeded");
}

async function seedSubmissions() {
  console.log("📸 Seeding Submissions...");

  const users = await prisma.user.findMany();
  const missions = await prisma.missions.findMany();

  const submissions: Prisma.MissionSubmissionCreateManyInput[] = [];

  for (const user of users) {
    const randomCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < randomCount; i++) {
      submissions.push({
        studentId: user.studentId,
        missionId: missions[Math.floor(Math.random() * missions.length)].id,
        imageLink: `https://picsum.photos/400/300?sub=${Math.random()}`,
        note: `Ghi chú của ${user.fullName}`,
        status: ["approved", "pending", "rejected"][Math.floor(Math.random() * 3)],
        for: "GLOBAL",
      });
    }
  }

  await prisma.missionSubmission.createMany({
    data: submissions,
  });

  console.log("✅ Mission Submissions seeded");
}

async function seedNews() {
  console.log("📰 Seeding News...");

  const users = await prisma.user.findMany();
  const submissions = await prisma.missionSubmission.findMany();

  const newsList: Prisma.NewsCreateInput[] = [];

  for (let i = 1; i <= 15; i++) {
    const author = users[Math.floor(Math.random() * users.length)];

    const baseNews: Prisma.NewsCreateInput = {
      title: `Bản tin số ${i}`,
      content:
        i % 2 === 0
          ? "Hoạt động Đoàn trường trong tuần vô cùng sôi nổi."
          : "Nhiều sự kiện diễn ra thu hút đông đảo đoàn viên tham gia.",
      imageUrl: `https://picsum.photos/500/300?news=${i}`,
      createdAt: new Date(Date.now() - i * 86400000),
      author: { connect: { studentId: author.studentId } },
    };

    // 40% news có submission liên kết
    if (i % 3 === 0 && submissions.length > 0) {
      const randomSub = submissions[Math.floor(Math.random() * submissions.length)];
      baseNews.submission = { connect: { id: randomSub.id } };
    }

    newsList.push(baseNews);
  }

  for (const n of newsList) {
    await prisma.news.create({ data: n });
  }

  console.log("✅ News seeded");
}

async function seedLikes() {
  console.log("❤️ Seeding News Likes...");

  const users = await prisma.user.findMany();
  const newsList = await prisma.news.findMany();

  for (const user of users) {
    const likedNews = newsList[Math.floor(Math.random() * newsList.length)];

    await prisma.newsLike.create({
      data: {
        newsId: likedNews.id,
        userId: user.studentId,
      },
    }).catch(() => { });
  }

  console.log("✅ News Likes seeded");
}

async function seedComments() {
  console.log("💬 Seeding News Comments...");

  const users = await prisma.user.findMany();
  const newsList = await prisma.news.findMany();

  const comments = [
    "Bài viết rất hay!",
    "Hoạt động ý nghĩa quá!",
    "Ủng hộ phong trào!",
    "Nhìn vui quá!",
    "Rất bổ ích!",
    "Tuyệt vời luôn!",
  ];

  for (const news of newsList) {
    const randomUser = users[Math.floor(Math.random() * users.length)];

    await prisma.newsComment.create({
      data: {
        newsId: news.id,
        userId: randomUser.studentId,
        content: comments[Math.floor(Math.random() * comments.length)],
      },
    });
  }

  console.log("✅ News Comments seeded");
}

async function seedMainNews() {
  console.log("📢 Seeding main_news...");

  await prisma.main_news.createMany({
    data: [
      { link: "https://tuoitre.vn/", image: "https://picsum.photos/400/200?mn=1" },
      { link: "https://thanhnien.vn/", image: "https://picsum.photos/400/200?mn=2" },
      { link: "https://vnexpress.net/", image: "https://picsum.photos/400/200?mn=3" },
      { link: "https://dantri.com.vn/", image: "https://picsum.photos/400/200?mn=4" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ main_news seeded");
}

async function seedDigiMap() {
  console.log("🗺 Seeding digiMap...");

  await prisma.digiMap.createMany({
    data: [
      { pinName: "Cổng chính trường", pinLink: "https://maps.google.com", joined: 150 },
      { pinName: "Thư viện", pinLink: "https://maps.google.com", joined: 80 },
      { pinName: "Nhà thi đấu", pinLink: "https://maps.google.com", joined: 120 },
      { pinName: "Khu A", pinLink: "https://maps.google.com", joined: 60 },
      { pinName: "Khu B", pinLink: "https://maps.google.com", joined: 75 },
    ],
    skipDuplicates: true,
  });

  console.log("✅ digiMap seeded");
}

async function main() {
  console.log("🌱 Starting FULL SEED...");

  await seedUsers();
  await seedMissions();
  await seedSubmissions();
  await seedNews();
  await seedLikes();
  await seedComments();
  await seedMainNews();
  await seedDigiMap();

  console.log("🌱 FULL SEED completed successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
