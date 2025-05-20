import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestRewardController } from './request-reward.controller';
import { RequestRewardService } from './request-reward.service';
import { RequestRewardRepository } from './request-reward.repository';
import {
  RequestReward,
  RequestRewardSchema,
} from '../schemas/request-reward.schema';
import { EventModule } from '../event/event.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { RewardModule } from '../reward/reward.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestReward.name, schema: RequestRewardSchema },
    ]),
    EventModule,
    AttendanceModule,
    RewardModule,
  ],
  controllers: [RequestRewardController],
  providers: [RequestRewardService, RequestRewardRepository],
  exports: [RequestRewardService],
})
export class RequestRewardModule {}
