import { SetMetadata } from '@nestjs/common';
import { PermissionValue } from '../permissions/permission.schema';

export const RequirePermissions = (...permissions: PermissionValue[]) =>
  SetMetadata('permissions', permissions);
