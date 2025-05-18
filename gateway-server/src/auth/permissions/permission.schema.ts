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

export const ROLE_PERMISSIONS = {
  user: [
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.CREATE}`,
    `${ResourceType.EVENT}:${PermissionAction.READ}`,
    `${ResourceType.REWARD}:${PermissionAction.READ}`,
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.READ_OWN}`,
  ],
  auditor: [
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.READ}`,
    `${ResourceType.REWARD}:${PermissionAction.READ}`,
    `${ResourceType.EVENT}:${PermissionAction.READ}`,
  ],
  operator: [
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.READ}`,
    `${ResourceType.REWARD}:${PermissionAction.READ}`,
    `${ResourceType.REWARD}:${PermissionAction.CREATE}`,
    `${ResourceType.REWARD}:${PermissionAction.UPDATE}`,
    `${ResourceType.EVENT}:${PermissionAction.READ}`,
    `${ResourceType.EVENT}:${PermissionAction.CREATE}`,
    `${ResourceType.EVENT}:${PermissionAction.UPDATE}`,
  ],
  admin: [
    `${ResourceType.EVENT}:${PermissionAction.CREATE}`,
    `${ResourceType.EVENT}:${PermissionAction.READ}`,
    `${ResourceType.EVENT}:${PermissionAction.UPDATE}`,
    `${ResourceType.EVENT}:${PermissionAction.DELETE}`,
    `${ResourceType.REWARD}:${PermissionAction.CREATE}`,
    `${ResourceType.REWARD}:${PermissionAction.READ}`,
    `${ResourceType.REWARD}:${PermissionAction.UPDATE}`,
    `${ResourceType.REWARD}:${PermissionAction.DELETE}`,
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.CREATE}`,
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.READ}`,
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.UPDATE}`,
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.DELETE}`,
  ],
};

@Schema()
export class Permission extends Document {
  @Prop({ required: true, unique: true })
  role: string;

  @Prop({ required: true, type: [String] })
  permissions: PermissionValue[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
