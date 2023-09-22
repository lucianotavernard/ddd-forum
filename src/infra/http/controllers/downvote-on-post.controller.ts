import { BadRequestException, Controller, Param, Post } from '@nestjs/common';

import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { DownvoteOnPostUseCase } from '@/domain/forum/application/use-cases/downvote-on-post';

@Controller('/posts/:postId/downvote')
export class DownvoteOnPostController {
  constructor(private readonly downvoteOnPost: DownvoteOnPostUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('postId') postId: string,
  ) {
    const authorId = user.sub;

    const result = await this.downvoteOnPost.execute({
      postId,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
