import { IsString } from 'class-validator';

// TODO: 유효성 검증 추가 필요.
export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
