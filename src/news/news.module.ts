import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';

@Module({
  controllers: [NewsController],
  providers: [NewsService, PrismaService],
})
export class NewsModule { }
