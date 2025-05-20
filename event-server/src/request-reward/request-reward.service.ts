import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestRewardRepository } from './request-reward.repository';
import { CreateRequestRewardDto } from './dto/create-request-reward.dto';
import { QueryRequestRewardDto } from './dto/query-request-reward.dto';
import { ProcessRequestRewardDto } from './dto/process-request-reward.dto';
import {
  RequestReward,
  RequestRewardResult,
} from '../schemas/request-reward.schema';
import { EventService } from '../event/event.service';
import { EventStatus } from '../schemas/event.schema';
import { EventConditionVerifier } from '../event-condition-verifier.model';
import { EventProvideBy } from '../schemas/event.schema';
import { AttendanceService } from '../attendance/attendance.service';
import { RewardService } from '../reward/reward.service';

/**
 * 리워드 요청을 처리하는 서비스
 * @class RequestRewardService
 */
@Injectable()
export class RequestRewardService {
  private readonly eventConditionVerifier: EventConditionVerifier;

  constructor(
    private readonly requestRewardRepository: RequestRewardRepository,
    private readonly eventService: EventService,
    private readonly attendanceService: AttendanceService,
    private readonly rewardService: RewardService,
  ) {
    this.eventConditionVerifier = new EventConditionVerifier(
      this.attendanceService,
    );
  }

  /**
   * 리워드 요청을 처리합니다.
   * @param createRequestRewardDto 리워드 요청 DTO
   * @returns 처리 결과를 포함한 RequestReward 객체
   */
  async requestReward(
    createRequestRewardDto: CreateRequestRewardDto,
  ): Promise<RequestReward> {
    const { user, eventId } = createRequestRewardDto;

    // 이벤트 존재 여부 및 활성 상태 확인
    const event = await this.eventService.findOne(eventId);
    if (!event) {
      return this.requestRewardRepository.create({
        user,
        eventId,
        result: RequestRewardResult.FAIL,
        message: 'Event not found',
        conditionSnapshot: event.condition,
        event: null,
      });
    }

    // 이벤트 활성 상태 확인
    if (event.status !== EventStatus.ACTIVE) {
      return this.requestRewardRepository.create({
        user,
        eventId,
        result: RequestRewardResult.FAIL,
        message: 'Event is not active',
        conditionSnapshot: event.condition,
        event: eventId,
      });
    }

    // 이벤트 기간 유효성 검사
    const now = new Date();
    if (now < event.startDate || now > event.endDate) {
      return this.requestRewardRepository.create({
        user,
        eventId,
        result: RequestRewardResult.FAIL,
        message: 'Event is not in valid period',
        conditionSnapshot: event.condition,
        event: eventId,
      });
    }

    // 이벤트 조건 확인 및 자동 검증
    if (event.provideBy === EventProvideBy.SYSTEM && event.condition) {
      const conditionMet = await this.eventConditionVerifier.verifyCondition(
        user, // user is a string (userId)
        event.condition,
      );

      if (!conditionMet) {
        return this.requestRewardRepository.create({
          user,
          eventId,
          result: RequestRewardResult.FAIL,
          message: 'Event condition not met',
          conditionSnapshot: event.condition,
          event: eventId,
        });
      }
    }

    // 모든 검증을 통과하면 성공적인 요청으로 처리
    const requestReward = await this.requestRewardRepository.create({
      user,
      eventId,
      result: RequestRewardResult.SUCCESS,
      message: 'Reward successfully claimed',
      conditionSnapshot: event.condition,
      event: eventId,
    });

    // 성공적으로 처리된 요청에 대한 보상 지급
    if (event.provideBy === EventProvideBy.SYSTEM && event.condition) {
      // TODO: 보상 지급 로직 구현
    }

    return requestReward;
  }

  async findAll(queryDto: QueryRequestRewardDto): Promise<RequestReward[]> {
    return this.requestRewardRepository.findAll(queryDto);
  }

  async findOne(id: string): Promise<RequestReward> {
    return this.requestRewardRepository.findOne(id);
  }

  /**
   * 운영자나 관리자가 보상 요청을 수동으로 처리합니다.
   * @param processRequestRewardDto 수동 처리 DTO
   * @returns 처리된 RequestReward 객체
   */
  async processManualRequest(
    processRequestRewardDto: ProcessRequestRewardDto,
  ): Promise<RequestReward> {
    const {
      requestId,
      result,
      message,
      processRewards = true,
    } = processRequestRewardDto;

    // 요청 존재 여부 확인
    const requestReward = await this.requestRewardRepository.findOne(requestId);
    if (!requestReward) {
      throw new NotFoundException('보상 요청을 찾을 수 없습니다.');
    }

    // 이미 처리된 요청인지 확인
    if (requestReward.isProcessed) {
      throw new BadRequestException('이미 처리된 보상 요청입니다.');
    }

    // 요청 상태 업데이트
    const now = new Date();
    const updatedRequestReward =
      await this.requestRewardRepository.findOneAndUpdate(requestId, {
        result,
        message:
          message ||
          (result === RequestRewardResult.SUCCESS
            ? '운영자에 의해 수동 승인됨'
            : '운영자에 의해 수동 거부됨'),
        isProcessed: true,
        processedAt: now,
      });

    // 성공적으로 처리된 요청에 대해 보상 지급 (옵션에 따라)
    if (result === RequestRewardResult.SUCCESS && processRewards) {
      // 이벤트 정보 가져오기
      const eventId = requestReward.event?.toString();
      if (eventId) {
        const event = await this.eventService.findOne(eventId);
        if (event) {
          // TODO: 실제 보상 지급 로직 구현
          // 보상 지급 처리 (예: reward 서비스 호출)
          // this.rewardService.processReward(...)
        }
      }
    }

    return updatedRequestReward;
  }
}
