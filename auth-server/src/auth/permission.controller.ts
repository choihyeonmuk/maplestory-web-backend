import { Controller, Post, Body } from '@nestjs/common';
import { PermissionService, PermissionValue } from './permission.service';

@Controller('auth/permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('check')
  async checkPermission(
    @Body() body: { role: string; permission: PermissionValue },
  ): Promise<{ allowed: boolean }> {
    const allowed = await this.permissionService.hasPermission(
      body.role,
      body.permission,
    );
    return { allowed };
  }
}
