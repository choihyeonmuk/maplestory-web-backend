import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface AuthenticatedUserPayload {
  sub: string; // User ID
  username: string;
  role?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class GatewayJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(
    payload: AuthenticatedUserPayload,
  ): Promise<AuthenticatedUserPayload> {
    return payload;
  }
}
