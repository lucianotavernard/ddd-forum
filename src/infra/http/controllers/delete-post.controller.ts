import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';

import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

import { DeletePostUseCase } from '@/domain/forum/application/use-cases/delete-post';

@Controller('/posts/:id')
export class DeletePostController {
  constructor(private readonly deletePost: DeletePostUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') postId: string) {
    const authorId = user.sub;

    const result = await this.deletePost.execute({
      postId,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
