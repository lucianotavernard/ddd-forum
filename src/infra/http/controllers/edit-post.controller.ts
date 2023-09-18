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

import { EditPostUseCase } from '@/domain/forum/application/use-cases/edit-post';

const editPostBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editPostBodySchema);

type EditPostBodySchema = z.infer<typeof editPostBodySchema>;

@Controller('/posts/:id')
export class EditPostController {
  constructor(private readonly editPost: EditPostUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditPostBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') postId: string,
  ) {
    const { title, content } = body;
    const authorId = user.sub;

    const result = await this.editPost.execute({
      title,
      content,
      authorId,
      postId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
