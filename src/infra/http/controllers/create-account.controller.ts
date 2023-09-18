import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';

import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { Public } from '@/infra/auth/public';

import { RegisterAuthorUseCase } from '@/domain/forum/application/use-cases/register-author';
import { EmailAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/email-already-exists';
import { UsernameAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/username-already-exists';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Public()
@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly registerAuthor: RegisterAuthorUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, username, password } = body;

    const result = await this.registerAuthor.execute({
      name,
      email,
      username,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case EmailAlreadyExistsError:
        case UsernameAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
