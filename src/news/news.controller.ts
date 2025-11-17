import { Controller, Get, Post, Param, Req, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard'
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) { }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string, @Req() req: any) {
    return this.newsService.toggleLike(+id, req.user.sub);
  }

  @Get()
  getAll(@Req() req: any) {
    return this.newsService.getAllNews(req.user?.sub);
  }

  @Get(':id')
  getDetail(@Param('id') id: string, @Req() req: any) {
    return this.newsService.getNewsDetail(+id, req.user?.sub);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.newsService.getComments(+id);
  }

  @Get(':id/comments/count')
  getCount(@Param('id') id: string) {
    return this.newsService.getCommentCount(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  addComment(
    @Param('id') id: string,
    @Body('content') content: string,
    @Req() req: any
  ) {
    return this.newsService.addComment(+id, req.user.sub, content);
  }
}
