import { BadRequestException, Controller, Param, Post } from '@nestjs/common';

import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { DownvoteOnCommentUseCase } from '@/domain/forum/application/use-cases/downvote-on-comment';

@Controller('/comments/:commentId/downvote')
export class DownvoteOnCommentController {
  constructor(private readonly downvoteOnComment: DownvoteOnCommentUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('commentId') commentId: string,
  ) {
    const authorId = user.sub;

    const result = await this.downvoteOnComment.execute({
      commentId,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
