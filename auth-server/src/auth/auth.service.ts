import { HttpException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
  }

  private generateToken(user: User) {
    const payload = {
      sub: user._id,
      username: user.username,
      role: user.role,
    };
    return this.jwtService.sign(payload, { secret: this.jwtSecret });
  }

  async register(registerDto: RegisterDto): Promise<{ token: string }> {
    const { username, password } = registerDto;
    const existing = await this.authRepository.findByUsername(username);
    if (existing) {
      throw new HttpException('User with this username already exists', 400);
    }

    // 비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.authRepository.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    const token = this.generateToken(user);

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { username, password } = loginDto;
    const user = await this.authRepository.findByUsername(username);

    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    const token = this.generateToken(user);

    return { token };
  }
}
