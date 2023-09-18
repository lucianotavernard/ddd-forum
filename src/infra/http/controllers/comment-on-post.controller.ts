import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';

import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { CommentOnPostUseCase } from '@/domain/forum/application/use-cases/comment-on-post';

const commentOnPostBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(commentOnPostBodySchema);

type CommentOnPostBodySchema = z.infer<typeof commentOnPostBodySchema>;

@Controller('/posts/:postId/comments')
export class CommentOnPostController {
  constructor(private commentOnPost: CommentOnPostUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CommentOnPostBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('postId') postId: string,
  ) {
    const { content } = body;
    const authorId = user.sub;

    const result = await this.commentOnPost.execute({
      content,
      postId,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
