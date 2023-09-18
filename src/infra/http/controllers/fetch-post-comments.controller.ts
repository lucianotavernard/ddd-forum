import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { Public } from '@/infra/auth/public';

import { FetchPostCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-post-comments';
import { CommentPresenter } from '../presenters/comment-presenter';

const pageQueryParamSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  per_page: z
    .string()
    .optional()
    .default('20')
    .transform(Number)
    .pipe(z.number().min(20)),
});

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Public()
@Controller('/posts/:postId/comments')
export class FetchPostCommentsController {
  constructor(private readonly fetchPostComments: FetchPostCommentsUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) { page, per_page }: PageQueryParamSchema,
    @Param('postId') postId: string,
  ) {
    const result = await this.fetchPostComments.execute({
      page,
      per_page,
      postId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const postComments = result.value.postComments;

    return {
      comments: postComments.map(CommentPresenter.toHTTP),
    };
  }
}
