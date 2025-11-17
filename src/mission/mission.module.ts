import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [MissionController],
  providers: [PrismaService],
})
export class MissionModule { }
