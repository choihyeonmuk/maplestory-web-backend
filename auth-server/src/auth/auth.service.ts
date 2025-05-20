import { HttpException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { StaffRegisterDto } from './dto/staff-register.dto';
import { StaffLoginDto } from './dto/staff-login.dto';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';
import { Staff } from '../schemas/staff.schema';
import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';
import { ROLE } from './auth.type';

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

  private generateUserToken(user: User) {
    const payload = {
      sub: user._id,
      username: user.username,
      role: ROLE.USER,
      userType: 'user',
    };
    return this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: '1h',
    });
  }

  private generateStaffToken(staff: Staff) {
    const payload = {
      sub: staff._id,
      username: staff.username,
      role: staff.role,
      userType: 'staff',
    };
    return this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: '1h',
    });
  }

  async registerUser(registerDto: RegisterDto): Promise<{ token: string }> {
    const { username, password } = registerDto;
    const existing = await this.authRepository.findUserByUsername(username);
    if (existing) {
      throw new HttpException('User with this username already exists', 400);
    }

    // 비밀번호 암호화 처리 (bcrypt 사용)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.authRepository.createUser({
      username,
      password: hashedPassword,
    });

    const token = this.generateUserToken(user);

    return { token };
  }

  async loginUser(loginDto: LoginDto): Promise<{ token: string }> {
    const { username, password } = loginDto;
    const user = await this.authRepository.findUserByUsername(username);

    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    const token = this.generateUserToken(user);

    return { token };
  }

  async registerStaff(
    staffRegisterDto: StaffRegisterDto,
  ): Promise<{ token: string }> {
    const { username, password, role } = staffRegisterDto;
    // Only allow ADMIN, OPERATOR, and AUDITOR roles
    if (![ROLE.ADMIN, ROLE.OPERATOR, ROLE.AUDITOR].includes(role)) {
      throw new HttpException('Invalid role for staff', 400);
    }

    const existing = await this.authRepository.findStaffByUsername(username);
    if (existing) {
      throw new HttpException('Staff with this username already exists', 400);
    }

    // 비밀번호 암호화 처리 (bcrypt 사용)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const staff = await this.authRepository.createStaff({
      username,
      password: hashedPassword,
      role,
    });

    const token = this.generateStaffToken(staff);

    return { token };
  }

  async loginStaff(staffLoginDto: StaffLoginDto): Promise<{ token: string }> {
    const { username, password } = staffLoginDto;
    const staff = await this.authRepository.findStaffByUsername(username);

    if (!staff) {
      throw new HttpException('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    const token = this.generateStaffToken(staff);

    return { token };
  }

  async verifyUser(userId: string): Promise<{ isActive: boolean }> {
    try {
      new mongoose.Types.ObjectId(userId); // ObjectId 형식인지 검증

      // First check if it's a regular user
      const user = await this.authRepository.findUserById(userId);
      if (user) {
        return { isActive: user.isActive };
      }

      // If not found as a user, check if it's a staff member
      const staff = await this.authRepository.findStaffById(userId);
      if (staff) {
        return { isActive: staff.isActive };
      }

      // Neither user nor staff found with this ID
      return { isActive: false };
    } catch {
      return { isActive: false };
    }
  }
}
