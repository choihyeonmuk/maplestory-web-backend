import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLE } from '../auth/auth.type';

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
  [ROLE.USER]: [
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.CREATE}`,
    `${ResourceType.EVENT}:${PermissionAction.READ}`,
    `${ResourceType.REWARD}:${PermissionAction.READ}`,
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.READ_OWN}`,
  ],
  [ROLE.AUDITOR]: [
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.READ}`,
    `${ResourceType.REWARD}:${PermissionAction.READ}`,
    `${ResourceType.EVENT}:${PermissionAction.READ}`,
  ],
  [ROLE.OPERATOR]: [
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.READ}`,
    `${ResourceType.REWARD}:${PermissionAction.READ}`,
    `${ResourceType.REWARD}:${PermissionAction.CREATE}`,
    `${ResourceType.REWARD}:${PermissionAction.UPDATE}`,
    `${ResourceType.EVENT}:${PermissionAction.READ}`,
    `${ResourceType.EVENT}:${PermissionAction.CREATE}`,
    `${ResourceType.EVENT}:${PermissionAction.UPDATE}`,
  ],
  [ROLE.ADMIN]: [
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

@Schema({
  versionKey: false,
})
export class Permission extends Document {
  @Prop({ required: true, unique: true })
  role: ROLE;

  @Prop({ required: true, type: [String] })
  permissions: PermissionValue[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
