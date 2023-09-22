import { BadRequestException, Controller, Param, Post } from '@nestjs/common';

import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { UpvoteOnCommentUseCase } from '@/domain/forum/application/use-cases/upvote-on-comment';

@Controller('/comments/:commentId/upvote')
export class UpvoteOnCommentController {
  constructor(private readonly upvoteOnComment: UpvoteOnCommentUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('commentId') commentId: string,
  ) {
    const authorId = user.sub;

    const result = await this.upvoteOnComment.execute({
      commentId,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
