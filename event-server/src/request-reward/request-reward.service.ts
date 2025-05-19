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
import { ExampleModel } from '../example.model';

/**
 * 리워드 요청을 처리하는 서비스
 * @class RequestRewardService
 */
@Injectable()
export class RequestRewardService {
  constructor(
    private readonly requestRewardRepository: RequestRewardRepository,
    private readonly eventService: EventService,
    private readonly exampleModel: ExampleModel,
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

    // 이벤트 조건 확인 및 자동 검증
    if (event.condition) {
      // ExampleModel을 사용하여, 사용자가 이벤트 조건을 충족하는지 확인
      const conditionMet = await this.exampleModel.verifyCondition(
        user, // user is a string (userId)
        event.condition.type,
        event.condition.details,
      );

      if (!conditionMet) {
        return this.requestRewardRepository.create({
          user,
          eventId,
          result: RequestRewardResult.FAIL,
          message: 'Event condition not met',
        });
      }
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
