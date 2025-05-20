import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RequestReward,
  RequestRewardResult,
} from '../schemas/request-reward.schema';
import { QueryRequestRewardDto } from './dto/query-request-reward.dto';

@Injectable()
export class RequestRewardRepository {
  constructor(
    @InjectModel(RequestReward.name)
    private readonly requestRewardModel: Model<RequestReward>,
  ) {}

  async create(data: {
    user: string;
    eventId: string;
    result: RequestRewardResult;
    message?: string;
    conditionSnapshot?: Record<string, any>;
    event?: string;
  }): Promise<RequestReward> {
    const createdRequestReward = new this.requestRewardModel({
      ...data,
      requestedAt: new Date(),
    });
    return createdRequestReward.save();
  }

  async findAll(queryDto: QueryRequestRewardDto): Promise<RequestReward[]> {
    const filter: any = {};

    if (queryDto.user) {
      filter.user = queryDto.user;
    }

    if (queryDto.eventId) {
      filter.eventId = queryDto.eventId;
    }

    if (queryDto.result) {
      filter.result = queryDto.result;
    }

    // Date range filtering
    if (queryDto.startDate || queryDto.endDate) {
      filter.requestedAt = {};

      if (queryDto.startDate) {
        filter.requestedAt.$gte = new Date(queryDto.startDate);
      }

      if (queryDto.endDate) {
        filter.requestedAt.$lte = new Date(queryDto.endDate);
      }
    }

    return this.requestRewardModel
      .find(filter)
      .sort({ requestedAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<RequestReward> {
    return this.requestRewardModel.findById(id).exec();
  }
}
