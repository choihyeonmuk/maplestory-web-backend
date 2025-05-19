import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PermissionValue,
  Permission,
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
    // DB에서 Permission document가 없으면 초기값을 생성하거나, 필요시 별도 마이그레이션 스크립트로 관리
    this.logger.log('Permission initialization skipped: now fully DB-based.');
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
    const permissionsDocs = await this.permissionModel.find({ role });
    for (const doc of permissionsDocs) {
      if (doc.permissions.includes(requiredPermission)) {
        return true;
      }
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
    const permissionsDocs = await this.permissionModel.find({ role });
    const userPermissions = new Set<PermissionValue>();
    for (const doc of permissionsDocs) {
      doc.permissions.forEach((permission) => userPermissions.add(permission));
    }
    return Array.from(userPermissions);
  }
}
