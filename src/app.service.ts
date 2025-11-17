import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  async getAllNews() {
    const news = await this.prisma.missionSubmission.findMany({
      where: {
        status: 'APPROVED',
      }
    });
    return news;
  }

  async getRankings(topic: string) {
    if (topic === 'personal') {
      const rankings = await this.prisma.user.findMany({
        select: {
          studentId: true,
          fullName: true,
          avatarUrl: true,
          points: true,
        },
        orderBy: { points: 'desc' },
        take: 10,
      })

      return rankings.map((user, i) => ({
        rank: i + 1,
        studentId: user.studentId,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        points: user.points,
      }))
    }

    if (topic === 'uniongroup') {
      const rankings = await this.prisma.user.groupBy({
        by: ['unionGroup'],
        _sum: { points: true },
        orderBy: {
          _sum: { points: 'desc' },
        },
        take: 10,
      })

      return rankings.map((r, i) => ({
        rank: i + 1,
        name: r.unionGroup,
        total_points: r._sum.points ?? 0,
      }))
    }
    return [];
  }
}
