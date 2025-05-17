import { IsEnum, IsString } from 'class-validator';
import { ROLE } from '../auth.type';

// TODO: 유효성 검증 추가 필요.
export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEnum(ROLE)
  role: ROLE;
}
