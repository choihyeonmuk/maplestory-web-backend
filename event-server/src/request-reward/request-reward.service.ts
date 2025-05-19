import { Injectable } from '@nestjs/common';
import { RequestRewardRepository } from './request-reward.repository';
import { CreateRequestRewardDto } from './dto/create-request-reward.dto';
import { QueryRequestRewardDto } from './dto/query-request-reward.dto';
import {
  RequestReward,
  RequestRewardResult,
} from '../schemas/request-reward.schema';
import { EventService } from '../event/event.service';
import { EventStatus } from '../schemas/event.schema';

/**
 * 리워드 요청을 처리하는 서비스
 * @class RequestRewardService
 */
@Injectable()
export class RequestRewardService {
  constructor(
    private readonly requestRewardRepository: RequestRewardRepository,
    private readonly eventService: EventService,
  ) {}

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
      });
    }

    // 이벤트 활성 상태 확인
    if (event.status !== EventStatus.ACTIVE) {
      return this.requestRewardRepository.create({
        user,
        eventId,
        result: RequestRewardResult.FAIL,
        message: 'Event is not active',
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
      });
    }

    // 이벤트 조건 확인 (필요에 따라 더 복잡한 로직 구현 가능)
    if (event.conditions) {
      // 여기서 사용자가 이벤트 조건을 충족하는지 확인하는 로직을 구현할 수 있습니다.
      // 예시로 조건이 있는지 여부만 확인하고 있습니다.
    }

    // 모든 검증을 통과하면 성공적인 요청으로 처리
    return this.requestRewardRepository.create({
      user,
      eventId,
      result: RequestRewardResult.SUCCESS,
      message: 'Reward successfully claimed',
    });
  }

  async findAll(queryDto: QueryRequestRewardDto): Promise<RequestReward[]> {
    return this.requestRewardRepository.findAll(queryDto);
  }

  async findOne(id: string): Promise<RequestReward> {
    return this.requestRewardRepository.findOne(id);
  }
}
