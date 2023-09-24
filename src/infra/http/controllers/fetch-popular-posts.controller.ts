import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { Public } from '@/infra/auth/public';

import { FetchPopularPostsUseCase } from '@/domain/forum/application/use-cases/fetch-popular-posts';
import { PostWithAuthorPresenter } from '../presenters/post-with-author-presenter';

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
@Controller('/posts/popular')
export class FetchPopularPostsController {
  constructor(private readonly fetchPopularPosts: FetchPopularPostsUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe) { page, per_page }: PageQueryParamSchema,
  ) {
    const result = await this.fetchPopularPosts.execute({
      page,
      per_page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const posts = result.value.posts;

    return {
      posts: posts.map(PostWithAuthorPresenter.toHTTP),
    };
  }
}
