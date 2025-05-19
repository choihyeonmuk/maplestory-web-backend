import { IsString, MinLength } from 'class-validator';

// 일반 사용자 회원가입 DTO
export class RegisterDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(4)
  password: string;
}
