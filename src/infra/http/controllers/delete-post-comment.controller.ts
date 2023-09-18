import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';

import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { DeletePostCommentUseCase } from '@/domain/forum/application/use-cases/delete-post-comment';

@Controller('/posts/comments/:id')
export class DeletePostCommentController {
  constructor(private readonly deletePostComment: DeletePostCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') postCommentId: string,
  ) {
    const authorId = user.sub;

    const result = await this.deletePostComment.execute({
      postCommentId,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
