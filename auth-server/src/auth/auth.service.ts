import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ success: boolean; message: string }> {
    const { username, password } = registerDto;
    const existing = await this.authRepository.findByUsername(username);
    if (existing) {
      return { success: false, message: 'Username already exists' };
    }

    // 비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 암호화된 비밀번호로 대체하여 저장
    await this.authRepository.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    return { success: true, message: 'Registered successfully' };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ success: boolean; message: string }> {
    const { username, password } = loginDto;
    const user = await this.authRepository.findByUsername(username);

    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    // bcrypt를 이용해 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid credentials' };
    }

    return { success: true, message: 'Login successful' };
  }
}
