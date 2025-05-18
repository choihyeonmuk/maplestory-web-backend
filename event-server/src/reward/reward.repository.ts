import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward } from '../schemas/reward.schema';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class RewardRepository {
  constructor(
    @InjectModel(Reward.name) private readonly rewardModel: Model<Reward>,
  ) {}

  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    const createdReward = new this.rewardModel(createRewardDto);
    return createdReward.save();
  }

  async findAll(): Promise<Reward[]> {
    return this.rewardModel.find().exec();
  }

  async findByEventId(eventId: string): Promise<Reward[]> {
    return this.rewardModel.find({ eventId }).exec();
  }

  async findOne(id: string): Promise<Reward> {
    return this.rewardModel.findById(id).exec();
  }

  async update(id: string, updateRewardDto: UpdateRewardDto): Promise<Reward> {
    return this.rewardModel
      .findByIdAndUpdate(id, updateRewardDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Reward> {
    return this.rewardModel.findByIdAndDelete(id).exec();
  }
}
