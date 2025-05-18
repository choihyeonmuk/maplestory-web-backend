import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Event } from './event.schema';

export enum RewardType {
  POINT = 'point',
  ITEM = 'item',
  COUPON = 'coupon',
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Reward {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, enum: RewardType })
  type: RewardType;

  @Prop({ required: true })
  targetId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Event.name,
    required: true,
  })
  event: Event;

  @Prop({ type: Date, required: false, index: -1 })
  createdAt: Date;

  @Prop({ type: Date, required: false })
  updatedAt: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
