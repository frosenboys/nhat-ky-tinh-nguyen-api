import {
  Controller, Get, Post, Body, Req, UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { UserService } from './user.service'
import { UpdatePasswordDto } from '../dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  updateAvatar(@Req() req, @Body('avatarUrl') avatarUrl: string) {
    return this.userService.updateAvatar(req.user.sub, avatarUrl)
  }


  @UseGuards(JwtAuthGuard)
  @Post('password')
  changePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    return this.userService.changePassword(req.user.sub, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('missions/submit')
  uploadMission(@Req() req, @Body() body: any) {
    const studentId = req.user.sub;
    return this.userService.uploadMission({
      studentId,
      missionId: Number(body.missionId),
      note: body.message,
      imageLink: body.imageUrl,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.userService.getProfile(req.user.sub)
  }

  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  getNotifications(@Req() req) {
    return this.userService.getNotifications(req.user.sub, req.user.unionGroup)
  }

  @UseGuards(JwtAuthGuard)
  @Get('missions')
  getMissionsStatus(@Req() req) {
    return this.userService.getMissionsStatus(req.user.sub)
  }
}
