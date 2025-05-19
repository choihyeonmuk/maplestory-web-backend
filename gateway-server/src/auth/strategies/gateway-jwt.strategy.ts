import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export interface AuthenticatedUserPayload {
  sub: string; // User or Staff ID
  username: string;
  role?: string; // Staff role - ADMIN, OPERATOR, AUDITOR
  userType: 'user' | 'staff'; // Identifies if this is a regular user or staff
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
      // Validate through auth-server based on userType (user or staff)
      const authUrl = this.configService.get<string>('AUTH_SERVER_URL');

      // Use the verify endpoint which now handles both users and staff
      const response = await firstValueFrom(
        this.httpService.get(`${authUrl}/auth/verify/${payload.sub}`),
      );

      // Check if the account is active
      if (!response.data?.isActive) {
        const accountType = payload.userType === 'staff' ? 'Staff' : 'User';
        throw new UnauthorizedException(
          `${accountType} account is inactive or has been deleted`,
        );
      }

      // Additional validation for staff roles if needed
      if (payload.userType === 'staff' && !payload.role) {
        throw new UnauthorizedException(
          'Staff account is missing required role information',
        );
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (error instanceof AxiosError) {
        // 인증 서비스 연결 오류 처리
        throw new UnauthorizedException('Unable to verify user authentication');
      }

      throw new UnauthorizedException('Invalid authentication credentials');
    }
  }
}
