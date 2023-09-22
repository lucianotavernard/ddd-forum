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

import { EditCommentUseCase } from '@/domain/forum/application/use-cases/edit-comment';

const editCommentBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editCommentBodySchema);

type EditCommentBodySchema = z.infer<typeof editCommentBodySchema>;

@Controller('/comments/:id')
export class EditCommentOnPostController {
  constructor(private readonly editComment: EditCommentUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditCommentBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') commentId: string,
  ) {
    const { content } = body;
    const authorId = user.sub;

    const result = await this.editComment.execute({
      content,
      authorId,
      commentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
