import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance } from '../schemas/attendance.schema';

@Injectable()
export class AttendanceRepository {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
  ) {}

  async create(userId: string): Promise<Attendance> {
    // Use today's date at midnight for consistent daily attendance tracking
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newAttendance = new this.attendanceModel({
      userId,
      attendanceDate: today,
    });

    return newAttendance.save();
  }

  async findByUserId(userId: string): Promise<Attendance[]> {
    return this.attendanceModel
      .find({ userId })
      .sort({ attendanceDate: -1 })
      .exec();
  }

  async countAttendance(userId: string, days: number = null): Promise<number> {
    // If days is provided, count attendance in the last X days
    // Otherwise count all attendance records
    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      return this.attendanceModel
        .countDocuments({
          userId,
          attendanceDate: { $gte: startDate },
        })
        .exec();
    }

    return this.attendanceModel.countDocuments({ userId }).exec();
  }

  async hasAttendedToday(userId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await this.attendanceModel
      .findOne({
        userId,
        attendanceDate: { $gte: today, $lt: tomorrow },
      })
      .exec();

    return !!todayAttendance;
  }
}
