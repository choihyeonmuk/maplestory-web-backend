import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export enum EventStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum EventProvideBy {
  MANUAL = 'manual',
  SYSTEM = 'system',
}

export enum EventConditionType {
  ATTENDANCE = 'attendance', // 출석 이벤트
  CONSECUTIVE_ATTENDANCE = 'consecutive_attendance', // 연속 출석 이벤트
  FRIEND_INVITATION = 'friend_invitation', // 친구 초대 이벤트
  QUEST_COMPLETION = 'quest_completion', // 퀘스트 완료 이벤트
  LEVEL_ACHIEVEMENT = 'level_achievement', // 레벨 달성 이벤트
  ITEM_COLLECTION = 'item_collection', // 아이템 수집 이벤트
  CUSTOM = 'custom', // 기타 커스텀 이벤트
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Event {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true, enum: EventStatus, default: EventStatus.INACTIVE })
  status: EventStatus;

  @Prop({
    required: true,
    enum: EventProvideBy,
    default: EventProvideBy.MANUAL,
  })
  provideBy: EventProvideBy;

  @Prop({ type: Date, required: false, index: -1 })
  createdAt: Date;

  @Prop({ type: Date, required: false })
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  condition: {
    type: EventConditionType;
    details: {
      // 필요한 횟수, 수량 등 기본 요구치
      requiredAmount?: number;
      // 연속 출석 이벤트 관련 필드
      consecutiveDays?: number;
      // 친구 초대 이벤트 관련 필드
      friendCount?: number;
      // 퀘스트 완료 이벤트 관련 필드
      questId?: string;
      // 레벨 달성 이벤트 관련 필드
      targetLevel?: number;
      // 아이템 수집 이벤트 관련 필드
      itemIds?: string[];
      itemCounts?: Record<string, number>;
      // 시간 제한이 있는 이벤트 관련 필드
      timeLimit?: number; // 초 단위
      // 커스텀 이벤트 조건을 위한 필드
      customLogic?: string;
      customParameters?: Record<string, any>;
    };
  };

  // 이벤트 참여 제한 사항
  @Prop({ type: mongoose.Schema.Types.Mixed, required: false })
  restrictions?: {
    maxParticipants?: number; // 최대 참여자 수
    maxRewardsPerUser?: number; // 유저당 최대 보상 수령 횟수
    minUserLevel?: number; // 최소 유저 레벨
    allowedUserTypes?: string[]; // 허용된 유저 타입
  };
}

export const EventSchema = SchemaFactory.createForClass(Event);
