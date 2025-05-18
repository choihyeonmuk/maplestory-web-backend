import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export enum EventStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
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

  @Prop({ type: Date, required: false, index: -1 })
  createdAt: Date;

  @Prop({ type: Date, required: false })
  updatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: false })
  conditions: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
