import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      secretOrKey: "ASDFGHJKL",
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
  }) {
    // console.log(payload);
    const user =
      await this.prisma.users.findUnique({
        where: {
          id: payload.sub,
        },
      });

    delete user.hash;
    return user;
  }
}
