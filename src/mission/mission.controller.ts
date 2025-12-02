import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { MissionUploadDto } from '../dto';

@Controller('mission')
export class MissionController {
  constructor(private prisma: PrismaService) { }

  @Get("/getAllMissions")
  async getAllMissions() {
    return this.prisma.missions.findMany({
      orderBy: { id: 'asc' },
    });
  }
  @Get("/getMissionbyId/:id")
  async getMissionById(@Param('id') id: string) {
    return this.prisma.missions.findUnique({
      where: { id: Number(id) },
    });
  }
}
