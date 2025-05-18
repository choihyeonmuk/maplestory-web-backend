import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { RewardRepository } from './reward.repository';
import { Reward, RewardSchema } from '../schemas/reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]),
  ],
  controllers: [RewardController],
  providers: [RewardService, RewardRepository],
  exports: [RewardService],
})
export class RewardModule {}
