import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Attendance } from '../schemas/attendance.schema';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * Record attendance for a user
   */
  @Post()
  async recordAttendance(
    @Body() createAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
    return this.attendanceService.recordAttendance(createAttendanceDto.userId);
  }

  /**
   * Get attendance records for a specific user
   */
  @Get('user/:userId')
  async getUserAttendance(
    @Param('userId') userId: string,
  ): Promise<Attendance[]> {
    return this.attendanceService.getUserAttendance(userId);
  }

  /**
   * Count attendance for a specific user
   */
  @Get('count/:userId')
  async countUserAttendance(
    @Param('userId') userId: string,
  ): Promise<{ count: number }> {
    const count = await this.attendanceService.countUserAttendance(userId);
    return { count };
  }

  /**
   * Count attendance for a specific user in the last X days
   */
  @Get('count/:userId/:days')
  async countUserAttendanceInDays(
    @Param('userId') userId: string,
    @Param('days') days: number,
  ): Promise<{ count: number }> {
    const count = await this.attendanceService.countUserAttendance(userId, days);
    return { count };
  }
}
