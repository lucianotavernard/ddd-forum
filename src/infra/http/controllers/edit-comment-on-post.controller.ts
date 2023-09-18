import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';

import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { EditCommentOnPostUseCase } from '@/domain/forum/application/use-cases/edit-comment-on-post';

const editCommentOnPostBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editCommentOnPostBodySchema);

type EditCommentOnPostBodySchema = z.infer<typeof editCommentOnPostBodySchema>;

@Controller('/posts/:postId/comments/:commentId')
export class EditCommentOnPostController {
  constructor(private readonly editCommentOnPost: EditCommentOnPostUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditCommentOnPostBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('commentId') commentId: string,
  ) {
    const { content } = body;
    const authorId = user.sub;
    const postCommentId = commentId;

    const result = await this.editCommentOnPost.execute({
      content,
      authorId,
      postCommentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
