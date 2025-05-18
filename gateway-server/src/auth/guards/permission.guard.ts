import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../permissions/permission.service';
import { PermissionValue } from '../permissions/permission.schema';
import { AuthenticatedUserPayload } from '../strategies/gateway-jwt.strategy';

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionValue[]
    >('permissions', [context.getHandler(), context.getClass()]);

    // If no permissions are required for this route, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUserPayload;

    // Check if user exists and has roles
    if (!user || !user.roles || user.roles.length === 0) {
      this.logger.warn('User has no roles or is not authenticated');
      throw new UnauthorizedException('Insufficient permissions');
    }

    this.logger.log(
      `Checking permissions for user ${user.username} with roles [${user.roles.join(', ')}]`,
    );

    // Check if the user has any of the required permissions
    for (const permission of requiredPermissions) {
      const hasPermission = await this.permissionService.hasPermission(
        user.roles,
        permission,
      );

      if (hasPermission) {
        this.logger.log(`User has permission: ${permission}`);
        return true;
      }
    }

    this.logger.warn(
      `User lacks required permissions: [${requiredPermissions.join(', ')}]`,
    );
    throw new UnauthorizedException('Insufficient permissions');
  }
}
