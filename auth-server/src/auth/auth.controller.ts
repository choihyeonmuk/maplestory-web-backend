import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { StaffRegisterDto } from './dto/staff-register.dto';
import { StaffLoginDto } from './dto/staff-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('user/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }

  @Post('staff/register')
  async staffRegister(@Body() staffRegisterDto: StaffRegisterDto) {
    return this.authService.registerStaff(staffRegisterDto);
  }

  @Post('staff/login')
  async staffLogin(@Body() staffLoginDto: StaffLoginDto) {
    return this.authService.loginStaff(staffLoginDto);
  }

  @Get('verify/:userId')
  async verifyUser(@Param('userId') userId: string) {
    return this.authService.verifyUser(userId);
  }
}
