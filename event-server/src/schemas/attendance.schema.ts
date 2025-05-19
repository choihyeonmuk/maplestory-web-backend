import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Attendance {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, type: Date })
  attendanceDate: Date;

  @Prop({ type: Date, required: false, index: -1 })
  createdAt: Date;

  @Prop({ type: Date, required: false })
  updatedAt: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

// Create a compound index on userId and attendanceDate to ensure a user can only check-in once per day
AttendanceSchema.index({ userId: 1, attendanceDate: 1 }, { unique: true });
