import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PermissionValue,
  Permission,
  ROLE_PERMISSIONS,
} from '../schemas/permission.schema';

export { PermissionValue };

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
    // 역할 별 권한을 초기화
    for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
      const existingPermission = await this.permissionModel.findOne({ role });
      if (!existingPermission) {
        // 역할에 대한 권한이 없으면 생성
        await this.permissionModel.create({
          role,
          permissions: permissions as PermissionValue[],
        });
        this.logger.log(`Created permissions for role: ${role}`);
      } else if (
        !this.arePermissionsEqual(
          existingPermission.permissions,
          permissions as PermissionValue[],
        )
      ) {
        // 역할에 대한 권한이 다르면 업데이트
        existingPermission.permissions = permissions as PermissionValue[];
        await existingPermission.save();
        this.logger.log(`Updated permissions for role: ${role}`);
      } else {
        this.logger.log(
          `Permissions for role ${role} already exist and are up to date`,
        );
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
    role: string,
    requiredPermission: PermissionValue,
  ): Promise<boolean> {
    if (!role) {
      return false;
    }
    // ADMIN은 항상 허용
    if (role === 'ADMIN') {
      return true;
    }

    // DB에서 해당 role의 permission을 조회
    const permissionDoc = await this.permissionModel.findOne({ role });
    if (
      permissionDoc &&
      permissionDoc.permissions.includes(requiredPermission)
    ) {
      return true;
    }
    return false;
  }

  async getUserPermissions(role: string): Promise<PermissionValue[]> {
    if (!role) {
      return [];
    }
    // ADMIN은 모든 권한
    if (role === 'ADMIN') {
      const all = await this.permissionModel.find();
      return Array.from(new Set(all.flatMap((doc) => doc.permissions)));
    }
    // 역할에 따른 권한 조회
    const permissionDoc = await this.permissionModel.findOne({ role });
    if (permissionDoc) {
      return permissionDoc.permissions;
    }
    return [];
  }
}
