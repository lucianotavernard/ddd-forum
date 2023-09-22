import { BadRequestException, Controller, Param, Post } from '@nestjs/common';

import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { UpvoteOnPostUseCase } from '@/domain/forum/application/use-cases/upvote-on-post';

@Controller('/posts/:postId/upvote')
export class UpvoteOnPostController {
  constructor(private readonly upvoteOnPost: UpvoteOnPostUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('postId') postId: string,
  ) {
    const authorId = user.sub;

    const result = await this.upvoteOnPost.execute({
      postId,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
