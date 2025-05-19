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
      // auth-server를 통해 사용자가 존재하고 활성화 상태인지 확인
      const authUrl = this.configService.get<string>('AUTH_SERVER_URL');

      const response = await firstValueFrom(
        this.httpService.get(`${authUrl}/auth/verify/${payload.sub}`),
      );

      // 사용자 확인에 실패하거나 사용자가 활성화되지 않은 경우 예외 발생
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
        // 인증 서비스 연결 오류 처리
        throw new UnauthorizedException('Unable to verify user authentication');
      }

      throw new UnauthorizedException('Invalid authentication credentials');
    }
  }
}
