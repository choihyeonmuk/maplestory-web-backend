import { Injectable } from '@nestjs/common';
import { AttendanceService } from './attendance/attendance.service';
import { EventConditionType } from './schemas/event.schema';

/**
 * 사용자가 이벤트 보상 수령 조건을 충족하는지 확인하는 모델
 */
@Injectable()
export class EventConditionVerifier {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * 사용자가 특정 이벤트의 조건을 충족했는지 확인
   * @param userId 확인할 사용자 ID
   * @param condition 이벤트 조건 객체(타입과 세부 정보 포함)
   * @returns 조건 충족 여부를 나타내는 불리언 값
   */
  async verifyCondition(
    userId: string,
    condition: {
      type: EventConditionType;
      details: {
        requiredAmount?: number;
        consecutiveDays?: number;
        [key: string]: any;
      };
    },
  ): Promise<boolean> {
    // 현재는 출석 타입만 처리
    if (condition.type === EventConditionType.ATTENDANCE) {
      return this.verifyAttendance(userId, condition.details);
    }

    // 다른 타입은 현재 false 반환
    return false;
  }

  /**
   * 사용자가 출석 이벤트에 필요한 만큼 출석했는지 확인
   * @param userId 확인할 사용자 ID
   * @param details 이벤트 조건 세부 정보
   * @returns 사용자가 조건을 충족하는지 여부
   */
  private async verifyAttendance(
    userId: string,
    details: { requiredAmount?: number },
  ): Promise<boolean> {
    const requiredAttendance = details.requiredAmount || 1;
    const attendanceCount =
      await this.attendanceService.countUserAttendance(userId);
    return attendanceCount >= requiredAttendance;
  }
}
