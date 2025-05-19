import { IsString } from 'class-validator';

// 관리자, 운영자, 감사관 로그인 DTO
export class StaffLoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
