import { IsEnum, IsString, MinLength } from 'class-validator';
import { ROLE } from '../auth.type';

// 관리자, 운영자, 감사관 회원가입 DTO
export class StaffRegisterDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsEnum(ROLE, { message: 'Role must be one of: ADMIN, OPERATOR, or AUDITOR' })
  role: ROLE;
}
