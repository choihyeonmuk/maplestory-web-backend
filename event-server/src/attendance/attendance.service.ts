import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';
import { Attendance } from '../schemas/attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /**
   * Record a user's attendance for today
   * @param userId User ID to record attendance for
   * @returns The created attendance record
   */
  async recordAttendance(userId: string): Promise<Attendance> {
    try {
      // Check if user has already attended today
      const hasAttended = await this.attendanceRepository.hasAttendedToday(userId);
      if (hasAttended) {
        throw new ConflictException('User has already attended today');
      }
      
      return await this.attendanceRepository.create(userId);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      // Handle duplicate key error (user already attended today)
      if (error.code === 11000) {
        throw new ConflictException('User has already attended today');
      }
      throw error;
    }
  }

  /**
   * Get all attendance records for a user
   * @param userId User ID to get attendance records for
   * @returns Array of attendance records
   */
  async getUserAttendance(userId: string): Promise<Attendance[]> {
    const records = await this.attendanceRepository.findByUserId(userId);
    if (!records.length) {
      throw new NotFoundException(
        `No attendance records found for user ${userId}`,
      );
    }
    return records;
  }

  /**
   * Count how many times a user has attended in the past X days
   * @param userId User ID to count attendance for
   * @param days Number of days to count back (optional)
   * @returns Number of attendance records
   */
  async countUserAttendance(userId: string, days?: number): Promise<number> {
    return this.attendanceRepository.countAttendance(userId, days);
  }

  /**
   * Check if a user has attended today
   * @param userId User ID to check
   * @returns Boolean indicating if user has attended today
   */
  async hasUserAttendedToday(userId: string): Promise<boolean> {
    return this.attendanceRepository.hasAttendedToday(userId);
  }
}
