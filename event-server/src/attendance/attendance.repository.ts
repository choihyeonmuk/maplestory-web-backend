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
    // 오늘의 날짜를 자정으로 설정하여 일일 출석 기록을 일관되게 추적
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
    // days가 제공되면 지난 X일의 출석 기록을 세고,
    // 그렇지 않으면 모든 출석 기록을 세는다.
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
