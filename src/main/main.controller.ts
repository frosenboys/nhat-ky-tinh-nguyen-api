import {
  Controller,
  Get,
  Param,
} from '@nestjs/common'
import { AppService } from './main.service';

@Controller('main')
export class MainController {
  constructor(private appService: AppService) { }

  @Get("digiMap")
  async getDigiMap() {
    return this.appService.getDigiMap();
  }

  @Get("ranking/:topic")
  async getRankings(@Param('topic') topic: string) {
    return this.appService.getRankings(topic);
  }

  @Get("main_page")
  async getMainPage() {
    return this.appService.getMainPage();
  }

}
