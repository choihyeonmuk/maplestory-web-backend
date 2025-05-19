import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ResourceType {
  EVENT = 'event',
  REWARD = 'reward',
  REQUEST_REWARD = 'request_reward',
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  READ_OWN = 'read_own',
}

export type PermissionValue = `${ResourceType}:${PermissionAction}`;


@Schema()
export class Permission extends Document {
  @Prop({ required: true, unique: true })
  role: string;

  @Prop({ required: true, type: [String] })
  permissions: PermissionValue[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
