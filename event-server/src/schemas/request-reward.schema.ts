import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Event } from './event.schema';
import { Reward } from './reward.schema';

export enum RequestRewardResult {
  SUCCESS = 'success',
  FAIL = 'fail',
  PENDING = 'pending',
}

export enum RequestRewardFailReason {
  CONDITION_NOT_MET = 'condition_not_met', // 이벤트 조건 미충족
  EVENT_EXPIRED = 'event_expired', // 이벤트 기간 만료
  EVENT_NOT_ACTIVE = 'event_not_active', // 이벤트 비활성화
  MAX_REWARDS_REACHED = 'max_rewards_reached', // 최대 보상 수령 횟수 초과
  USER_NOT_ELIGIBLE = 'user_not_eligible', // 유저 자격 미충족 (레벨 등)
  SYSTEM_ERROR = 'system_error', // 시스템 오류
  ALREADY_CLAIMED = 'already_claimed', // 이미 수령한 보상
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class RequestReward {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  requestedAt: Date;

  @Prop({ required: true, enum: RequestRewardResult })
  result: RequestRewardResult;

  @Prop({ required: false, enum: RequestRewardFailReason })
  failReason: RequestRewardFailReason;

  @Prop({ required: false })
  message: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Event.name,
    required: true,
  })
  event: Event;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Reward.name }],
    required: false,
  })
  rewards: Reward[];

  @Prop({ type: mongoose.Schema.Types.Mixed, required: false })
  conditionSnapshot: Record<string, any>;

  @Prop({ type: Boolean, default: false })
  isProcessed: boolean;

  @Prop({ type: Date, required: false })
  processedAt: Date;

  @Prop({ type: Date, required: false, index: -1 })
  createdAt: Date;

  @Prop({ type: Date, required: false })
  updatedAt: Date;
}

export const RequestRewardSchema = SchemaFactory.createForClass(RequestReward);
