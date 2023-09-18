import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';

import { EnvService } from '../env/env.service';

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: EnvService) {
    const jwtSecret = config.get('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload);
  }
}
