import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';

import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { DeleteCommentUseCase } from '@/domain/forum/application/use-cases/delete-comment';

@Controller('/comments/:id')
export class DeletePostCommentController {
  constructor(private readonly deleteComment: DeleteCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') commentId: string,
  ) {
    const authorId = user.sub;

    const result = await this.deleteComment.execute({
      commentId,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
