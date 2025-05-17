import { IsEnum, IsString, MinLength } from 'class-validator';
import { ROLE } from '../auth.type';

// TODO: 유효성 검증 추가 필요.
export class RegisterDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsEnum(ROLE)
  role: ROLE;
}
