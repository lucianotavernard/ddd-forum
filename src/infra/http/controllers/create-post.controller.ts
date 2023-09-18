import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { CreatePostUseCase } from '@/domain/forum/application/use-cases/create-post';

const createPostBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createPostBodySchema);

type CreatePostBodySchema = z.infer<typeof createPostBodySchema>;

@Controller('/posts')
export class CreatePostController {
  constructor(private readonly createPost: CreatePostUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreatePostBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body;
    const authorId = user.sub;

    const result = await this.createPost.execute({
      title,
      content,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
