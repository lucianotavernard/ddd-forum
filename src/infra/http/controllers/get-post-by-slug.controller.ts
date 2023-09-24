import { BadRequestException, Controller, Get, Param } from '@nestjs/common';

import { Public } from '@/infra/auth/public';

import { GetPostBySlugUseCase } from '@/domain/forum/application/use-cases/get-post-by-slug';
import { PostWithAuthorPresenter } from '../presenters/post-with-author-presenter';

@Public()
@Controller('/posts/:slug')
export class GetPostBySlugController {
  constructor(private readonly getPostBySlug: GetPostBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getPostBySlug.execute({
      slug,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      post: PostWithAuthorPresenter.toHTTP(result.value.post),
    };
  }
}
