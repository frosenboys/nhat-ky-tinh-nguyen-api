import { Module } from '@nestjs/common'
import { MainController } from './main.controller'
import { PrismaService } from '../prisma/prisma.service'
import { AppService } from './main.service';
@Module({
  controllers: [MainController],
  providers: [PrismaService, AppService],
  exports: [AppService]
})
export class MainModule { }
