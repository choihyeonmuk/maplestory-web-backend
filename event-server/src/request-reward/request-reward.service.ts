import { Injectable } from '@nestjs/common';
import { RequestRewardRepository } from './request-reward.repository';
import { CreateRequestRewardDto } from './dto/create-request-reward.dto';
import { QueryRequestRewardDto } from './dto/query-request-reward.dto';
import { RequestReward, RequestRewardResult } from '../schemas/request-reward.schema';
import { EventService } from '../event/event.service';
import { EventStatus } from '../schemas/event.schema';

@Injectable()
export class RequestRewardService {
  constructor(
    private readonly requestRewardRepository: RequestRewardRepository,
    private readonly eventService: EventService,
  ) {}

  async requestReward(createRequestRewardDto: CreateRequestRewardDto): Promise<RequestReward> {
    const { user, eventId } = createRequestRewardDto;
    
    // Check if event exists and is active
    const event = await this.eventService.findOne(eventId);
    if (!event) {
      return this.requestRewardRepository.create({
        user,
        eventId,
        result: RequestRewardResult.FAIL,
        message: 'Event not found',
      });
    }

    // Check if event is active
    if (event.status !== EventStatus.ACTIVE) {
      return this.requestRewardRepository.create({
        user,
        eventId,
        result: RequestRewardResult.FAIL,
        message: 'Event is not active',
      });
    }

    // Check if event period is valid
    const now = new Date();
    if (now < event.startDate || now > event.endDate) {
      return this.requestRewardRepository.create({
        user,
        eventId,
        result: RequestRewardResult.FAIL,
        message: 'Event is not in valid period',
      });
    }

    // Check event conditions (you can implement more complex logic here)
    if (event.conditions) {
      // Here you would implement the specific logic to check if the user
      // meets the event conditions. For simplicity, we're just checking
      // if conditions exist.
    }

    // If all checks pass, create a successful request
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
