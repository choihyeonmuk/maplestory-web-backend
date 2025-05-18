import { Injectable } from '@nestjs/common';
import { RewardRepository } from './reward.repository';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { Reward } from '../schemas/reward.schema';

@Injectable()
export class RewardService {
  constructor(private readonly rewardRepository: RewardRepository) {}

  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    return this.rewardRepository.create(createRewardDto);
  }

  async findAll(): Promise<Reward[]> {
    return this.rewardRepository.findAll();
  }

  async findByEventId(eventId: string): Promise<Reward[]> {
    return this.rewardRepository.findByEventId(eventId);
  }

  async findOne(id: string): Promise<Reward> {
    return this.rewardRepository.findOne(id);
  }

  async update(id: string, updateRewardDto: UpdateRewardDto): Promise<Reward> {
    return this.rewardRepository.update(id, updateRewardDto);
  }

  async remove(id: string): Promise<Reward> {
    return this.rewardRepository.remove(id);
  }
}
