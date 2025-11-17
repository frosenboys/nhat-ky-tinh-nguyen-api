import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) { }

  // Lấy danh sách News
  async getAllNews(userId?: string) {
    const news = await this.prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { fullName: true, avatarUrl: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    // Đính kèm trạng thái liked cho từng bài
    if (userId) {
      for (const n of news) {
        n["liked"] = !!(await this.prisma.newsLike.findUnique({
          where: { newsId_userId: { newsId: n.id, userId } }
        }));
      }
    }

    return news;
  }

  // Chi tiết News
  async getNewsDetail(id: number, userId?: string) {
    const data = await this.prisma.news.findUnique({
      where: { id },
      include: {
        author: { select: { fullName: true, avatarUrl: true } },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { fullName: true, avatarUrl: true } },
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!data) return null;

    // Kiểm tra đã like chưa
    if (userId) {
      data["liked"] = !!(await this.prisma.newsLike.findUnique({
        where: { newsId_userId: { newsId: id, userId } }
      }));
    }

    return data;
  }

  // Like 1 lần (không toggle)
  async toggleLike(newsId: number, userId: string) {
    if (!userId) throw new BadRequestException("Missing userId");

    const existing = await this.prisma.newsLike.findUnique({
      where: {
        newsId_userId: {
          newsId,
          userId,
        },
      },
    });

    if (existing) return { liked: true };

    await this.prisma.newsLike.create({
      data: { newsId, userId },
    });

    return { liked: true };
  }


  // Số comment
  async getCommentCount(newsId: number) {
    return {
      count: await this.prisma.newsComment.count({ where: { newsId } }),
    };
  }

  // Danh sách comment
  async getComments(newsId: number) {
    return this.prisma.newsComment.findMany({
      where: { newsId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, avatarUrl: true } },
      },
    });
  }

  // Thêm comment
  async addComment(newsId: number, userId: string, content: string) {
    return this.prisma.newsComment.create({
      data: { newsId, userId, content },
    });
  }
}
