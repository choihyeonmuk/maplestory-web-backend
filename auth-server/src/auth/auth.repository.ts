import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Staff } from '../schemas/staff.schema';
import { RegisterDto } from './dto/register.dto';
import { StaffRegisterDto } from './dto/staff-register.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Staff.name) private readonly staffModel: Model<Staff>,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<User> {
    const createdUser = new this.userModel(registerDto);
    return createdUser.save();
  }

  async createStaff(staffRegisterDto: StaffRegisterDto): Promise<Staff> {
    const createdStaff = new this.staffModel(staffRegisterDto);
    return createdStaff.save();
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username, isActive: true });
  }

  async findStaffByUsername(username: string): Promise<Staff | null> {
    return this.staffModel.findOne({ username, isActive: true });
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.userModel.findOne({ _id: userId, isActive: true });
  }

  async findStaffById(staffId: string): Promise<Staff | null> {
    return this.staffModel.findOne({ _id: staffId, isActive: true });
  }

  // For backward compatibility
  async findByUsername(username: string): Promise<User | Staff | null> {
    const user = await this.findUserByUsername(username);
    if (user) return user;

    return this.findStaffByUsername(username);
  }
}
