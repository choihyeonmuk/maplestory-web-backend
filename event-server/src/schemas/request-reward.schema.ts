import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Event } from './event.schema';

export enum RequestRewardResult {
  SUCCESS = 'success',
  FAIL = 'fail',
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

  @Prop({ required: false })
  message: string;

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

export const RequestRewardSchema = SchemaFactory.createForClass(RequestReward);
