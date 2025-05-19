import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export interface AuthenticatedUserPayload {
  sub: string; // User ID
  username: string;
  role?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class GatewayJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(
    payload: AuthenticatedUserPayload,
  ): Promise<AuthenticatedUserPayload> {
    try {
      // Verify that the user still exists and is active by checking with auth-server
      const authUrl = this.configService.get<string>('AUTH_SERVER_URL');

      const response = await firstValueFrom(
        this.httpService.get(`${authUrl}/auth/verify/${payload.sub}`),
      );

      // If user check fails or user is not active, throw an exception
      if (!response.data?.isActive) {
        throw new UnauthorizedException(
          'User account is inactive or has been deleted',
        );
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (error instanceof AxiosError) {
        // Handle auth service connection errors
        console.error('Error verifying user:', error.message);
        throw new UnauthorizedException('Unable to verify user authentication');
      }

      throw new UnauthorizedException('Invalid authentication credentials');
    }
  }
}
