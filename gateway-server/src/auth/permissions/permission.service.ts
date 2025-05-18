import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Permission,
  PermissionValue,
  ROLE_PERMISSIONS,
} from './permission.schema';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {
    this.initializePermissions();
  }

  private async initializePermissions() {
    this.logger.log('Initializing permissions...');

    // Create permissions for each role
    for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
      const existingPermission = await this.permissionModel.findOne({ role });

      if (!existingPermission) {
        this.logger.log(`Creating permissions for role: ${role}`);
        await this.permissionModel.create({
          role,
          permissions,
        });
      } else {
        // Update if there's any change
        const hasChanges = !this.arePermissionsEqual(
          existingPermission.permissions,
          permissions as PermissionValue[],
        );

        if (hasChanges) {
          this.logger.log(`Updating permissions for role: ${role}`);
          existingPermission.permissions = permissions as PermissionValue[];
          await existingPermission.save();
        }
      }
    }

    this.logger.log('Permissions initialization complete');
  }

  private arePermissionsEqual(
    existing: PermissionValue[],
    updated: PermissionValue[],
  ): boolean {
    if (existing.length !== updated.length) return false;

    const sortedExisting = [...existing].sort();
    const sortedUpdated = [...updated].sort();

    return sortedExisting.every(
      (permission, index) => permission === sortedUpdated[index],
    );
  }

  async hasPermission(
    roles: string[],
    requiredPermission: PermissionValue,
  ): Promise<boolean> {
    if (!roles || roles.length === 0) {
      return false;
    }

    // Admin has all permissions
    if (roles.includes('admin')) {
      return true;
    }

    // Check permission for each role
    for (const role of roles) {
      const rolePermissions = await this.permissionModel.findOne({ role });

      if (
        rolePermissions &&
        rolePermissions.permissions.includes(requiredPermission)
      ) {
        return true;
      }
    }

    return false;
  }

  async getUserPermissions(roles: string[]): Promise<PermissionValue[]> {
    if (!roles || roles.length === 0) {
      return [];
    }

    // If user is admin, return all permissions
    if (roles.includes('admin')) {
      return Object.values(ROLE_PERMISSIONS).flat() as PermissionValue[];
    }

    // Get permissions for each role and combine them
    const userPermissions = new Set<PermissionValue>();

    for (const role of roles) {
      const rolePermissions = await this.permissionModel.findOne({ role });

      if (rolePermissions) {
        rolePermissions.permissions.forEach((permission) =>
          userPermissions.add(permission),
        );
      }
    }

    return Array.from(userPermissions);
  }
}
