import { Injectable } from '@nestjs/common';
import { AttendanceService } from './attendance/attendance.service';
import { EventConditionType } from './schemas/event.schema';

/**
 * Example model that contains verification logic for various event types
 */
@Injectable()
export class ExampleModel {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * Verify if a user has met the conditions for a specific event
   * @param userId The user ID to check
   * @param conditionType The type of event condition
   * @param conditionDetails The details of the condition
   * @returns A boolean indicating if the condition is met
   */
  async verifyCondition(
    userId: string,
    conditionType: EventConditionType,
    conditionDetails: any,
  ): Promise<boolean> {
    switch (conditionType) {
      case EventConditionType.ATTENDANCE:
        return this.verifyAttendance(userId, conditionDetails);
      case EventConditionType.CONSECUTIVE_ATTENDANCE:
        return this.verifyConsecutiveAttendance(userId, conditionDetails);
      default:
        return false;
    }
  }

  /**
   * Verify if a user has attended enough days for an attendance event
   * @param userId User ID to check
   * @param details Event condition details
   * @returns Whether the user meets the condition
   */
  private async verifyAttendance(
    userId: string,
    details: { requiredAmount?: number },
  ): Promise<boolean> {
    const requiredAttendance = details.requiredAmount || 1;
    const attendanceCount = await this.attendanceService.countUserAttendance(userId);
    return attendanceCount >= requiredAttendance;
  }

  /**
   * Verify if a user has consecutively attended for a specific number of days
   * This is a simplified verification implementation
   * @param userId User ID to check
   * @param details Event condition details
   * @returns Whether the user meets the condition
   */
  private async verifyConsecutiveAttendance(
    userId: string,
    details: { consecutiveDays?: number },
  ): Promise<boolean> {
    // For this simplified example, we'll just check if the total attendance meets the required count
    // In a real implementation, you would check for consecutive days
    const requiredDays = details.consecutiveDays || 1;
    const attendanceCount = await this.attendanceService.countUserAttendance(
      userId,
      requiredDays,
    );
    return attendanceCount >= requiredDays;
  }
}
