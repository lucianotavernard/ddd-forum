import { Module } from '@nestjs/common';

import { Encrypter } from '@/domain/forum/application/providers/encrypter';
import { HashComparer } from '@/domain/forum/application/providers/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/providers/hash-generator';

import { JwtEncrypter } from './jwt-encrypter';
import { BcryptHasher } from './bcrypt-hasher';

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class ProviderModule {}
