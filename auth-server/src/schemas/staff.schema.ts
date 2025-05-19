import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ROLE } from '../auth/auth.type';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Staff {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: [ROLE.ADMIN, ROLE.OPERATOR, ROLE.AUDITOR] })
  role: ROLE;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date, required: false, index: -1 })
  createdAt: Date;

  @Prop({ type: Date, required: false })
  updatedAt: Date;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
