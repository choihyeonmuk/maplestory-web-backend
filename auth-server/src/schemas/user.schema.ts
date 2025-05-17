import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ROLE } from '../auth/auth.type';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: ROLE;

  @Prop({ type: Date, required: false, index: -1 })
  createdAt: Date;

  @Prop({ type: Date, required: false })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 1 });
