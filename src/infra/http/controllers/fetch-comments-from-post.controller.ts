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

import { FetchCommentsFromPostUseCase } from '@/domain/forum/application/use-cases/fetch-post-comments-from-post';
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
@Controller('/posts/:id/comments')
export class FetchPostCommentsController {
  constructor(private readonly fetchComments: FetchCommentsFromPostUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) { page, per_page }: PageQueryParamSchema,
    @Param('id') postId: string,
  ) {
    const result = await this.fetchComments.execute({
      page,
      per_page,
      postId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.comments;

    return {
      comments: comments.map(CommentPresenter.toHTTP),
    };
  }
}
