import { prisma } from "@/lib/db";

export async function GET(req, { params }) {
  // For /api/school-dashboard/[schoolId]
  const schoolId = params.schoolId;

  if (!schoolId)
    return Response.json({ error: "Missing schoolId" }, { status: 400 });

  // 1. Get students in school
  const students = await prisma.user.findMany({
    where: { schoolId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarSeed: true,
      avatarColor: true,
    },
  });

  // 2. Get all reading logs in school (optionally, only approved)
  const logs = await prisma.readingLog.findMany({
    where: {
      user: { schoolId },
      // status: "APPROVED", // Uncomment if you only want approved
    },
    select: {
      id: true,
      userId: true,
      title: true,
      duration: true,
      timestamp: true,
      status: true,
    },
  });

  // 3. Get all rewards for users in this school
  const userIds = students.map((u) => u.id);

  const rewards = await prisma.tokenReward.findMany({
    where: {
      log: { userId: { in: userIds } },
    },
    select: {
      id: true,
      logId: true,
      tokenType: true,
      tokenValue: true,
      log: { select: { userId: true } },
    },
  });

  const flatRewards = rewards.map((r) => ({
    ...r,
    userId: r.log.userId,
    log: undefined,
  }));

  // 4. Optionally, get school stats
  const totalBooks = logs.length;
  const totalTokens = flatRewards.reduce(
    (acc, r) => acc + (r.tokenValue || 0),
    0
  );
  const totalMinutes = logs.reduce((acc, l) => acc + (l.duration || 0), 0);

  // Helper to calculate streak
  function calcStreak(logs) {
    const dates = logs
      .map((l) => l.timestamp?.toISOString().slice(0, 10))
      .sort()
      .reverse();
    let streak = 0,
      last = null;
    for (let d of dates) {
      if (!last) {
        last = d;
        streak++;
        continue;
      }
      let prev = new Date(last),
        curr = new Date(d);
      prev.setDate(prev.getDate() - 1);
      if (curr.toISOString().slice(0, 10) === prev.toISOString().slice(0, 10)) {
        streak++;
        last = d;
      } else break;
    }
    return streak;
  }

  // Calculate max streak for all students
  let maxStreak = 0;
  for (let student of students) {
    const sLogs = logs.filter((l) => l.userId === student.id);
    const streak = calcStreak(sLogs);
    if (streak > maxStreak) maxStreak = streak;
  }

  const stats = {
    students: students.length,
    books: totalBooks,
    tokens: totalTokens,
    minutes: totalMinutes,
    streak: maxStreak,
  };

  return Response.json({
    students,
    logs,
    rewards: flatRewards,
    stats,
  });
}
