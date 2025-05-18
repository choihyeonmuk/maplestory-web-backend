import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  Res,
  Param,
  Body,
  Query,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';

// Add authenticated request interface
interface AuthenticatedRequest extends ExpressRequest {
  user?: AuthenticatedUserPayload;
}
import { ProxyService } from './proxy.service';
import { AuthenticatedUserPayload } from '../auth/strategies/gateway-jwt.strategy';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import {
  PermissionAction,
  ResourceType,
} from '../auth/permissions/permission.schema';
import { PermissionGuard } from '../auth/guards/permission.guard';

@Controller()
@UseGuards(PermissionGuard)
export class EventProxyController {
  private readonly logger = new Logger(EventProxyController.name);

  constructor(private readonly proxyService: ProxyService) {}

  // Event endpoints
  @Get('events')
  @RequirePermissions(`${ResourceType.EVENT}:${PermissionAction.READ}`)
  async getEvents(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query() query: any,
  ) {
    this.logger.log('Proxying GET /events request');
    return await this.handleRequest(
      req,
      res,
      null,
      query,
      req.user as AuthenticatedUserPayload,
      req.headers,
    );
  }

  @Get('events/:id')
  @RequirePermissions(`${ResourceType.EVENT}:${PermissionAction.READ}`)
  async getEventById(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.logger.log(`Proxying GET /events/${id} request`);
    return await this.handleRequest(
      req,
      res,
      null,
      req.query,
      req.user as AuthenticatedUserPayload,
      req.headers,
    );
  }

  @Post('events')
  @RequirePermissions(`${ResourceType.EVENT}:${PermissionAction.CREATE}`)
  async createEvent(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: any,
  ) {
    this.logger.log('Proxying POST /events request');
    return await this.handleRequest(
      req,
      res,
      body,
      req.query,
      req.user as AuthenticatedUserPayload,
      req.headers,
    );
  }

  @Put('events/:id')
  @RequirePermissions(`${ResourceType.EVENT}:${PermissionAction.UPDATE}`)
  async updateEvent(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    this.logger.log(`Proxying PUT /events/${id} request`);
    return await this.handleRequest(
      req,
      res,
      body,
      req.query,
      req.user as AuthenticatedUserPayload,
      req.headers,
    );
  }

  @Delete('events/:id')
  @RequirePermissions(`${ResourceType.EVENT}:${PermissionAction.DELETE}`)
  async deleteEvent(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.logger.log(`Proxying DELETE /events/${id} request`);
    return await this.handleRequest(
      req,
      res,
      null,
      req.query,
      req.user as AuthenticatedUserPayload,
      req.headers,
    );
  }

  // Reward endpoints
  @Get('rewards')
  @RequirePermissions(`${ResourceType.REWARD}:${PermissionAction.READ}`)
  async getRewards(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query() query: any,
  ) {
    this.logger.log('Proxying GET /rewards request');
    return await this.handleRequest(
      req,
      res,
      null,
      query,
      req.user as AuthenticatedUserPayload,
      req.headers,
    );
  }

  @Get('rewards/:id')
  @RequirePermissions(`${ResourceType.REWARD}:${PermissionAction.READ}`)
  async getRewardById(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.logger.log(`Proxying GET /rewards/${id} request`);
    return await this.handleRequest(
      req,
      res,
      null,
      req.query,
      req.user as AuthenticatedUserPayload,
      req.headers,
    );
  }

  @Post('rewards')
  @RequirePermissions(`${ResourceType.REWARD}:${PermissionAction.CREATE}`)
  async createReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: any,
  ) {
    this.logger.log('Proxying POST /rewards request');
    return await this.handleRequest(
      req,
      res,
      body,
      req.query,
      req.user as AuthenticatedUserPayload,
      req.headers,
    );
  }

  @Put('rewards/:id')
  @RequirePermissions(`${ResourceType.REWARD}:${PermissionAction.UPDATE}`)
  async updateReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    this.logger.log(`Proxying PUT /rewards/${id} request`);
    return await this.handleRequest(
      req,
      res,
      body,
      req.query,
      req.user as AuthenticatedUserPayload,
      req.headers,
    );
  }

  @Delete('rewards/:id')
  @RequirePermissions(`${ResourceType.REWARD}:${PermissionAction.DELETE}`)
  async deleteReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.logger.log(`Proxying DELETE /rewards/${id} request`);
    return await this.handleRequest(
      req,
      res,
      null,
      req.query,
      req.user as AuthenticatedUserPayload,
      req.headers,
    );
  }

  // Request-Reward endpoints
  @Get('request-rewards')
  @RequirePermissions(`${ResourceType.REQUEST_REWARD}:${PermissionAction.READ}`)
  async getRequestRewards(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;

    // For users with only READ_OWN permission, filter to only return their own requests
    if (
      user &&
      user.roles.includes('user') &&
      !user.roles.some((role) =>
        ['admin', 'operator', 'auditor'].includes(role),
      )
    ) {
      if (!query) query = {};
      query.userId = user.sub; // Add user ID filter to the query
      this.logger.log(`Filtering request-rewards for user ${user.sub}`);
    }

    this.logger.log('Proxying GET /request-rewards request');
    return await this.handleRequest(req, res, null, query, user, req.headers);
  }

  @Get('request-rewards/:id')
  async getRequestRewardById(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const user = req.user as AuthenticatedUserPayload;
    // Regular users can only view their own request-rewards, others can view all
    if (
      user &&
      user.roles.includes('user') &&
      !user.roles.some((role) =>
        ['admin', 'operator', 'auditor'].includes(role),
      )
    ) {
      // We'll let the backend validate if this request belongs to the user
      // The backend should check the user ID from the headers
      this.logger.log(
        `User ${user.sub} accessing request-reward ${id}, will be validated by backend`,
      );
    }

    this.logger.log(`Proxying GET /request-rewards/${id} request`);
    return await this.handleRequest(
      req,
      res,
      null,
      req.query,
      user,
      req.headers,
    );
  }

  @Post('request-rewards')
  @RequirePermissions(
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.CREATE}`,
  )
  async createRequestReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;

    // Ensure the request is associated with the current user if they are a regular user
    if (user && user.roles.includes('user') && !user.roles.includes('admin')) {
      body.userId = user.sub;
      this.logger.log(
        `Setting userId to ${user.sub} for request-reward creation`,
      );
    }

    this.logger.log('Proxying POST /request-rewards request');
    return await this.handleRequest(
      req,
      res,
      body,
      req.query,
      user,
      req.headers,
    );
  }

  @Put('request-rewards/:id')
  @RequirePermissions(
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.UPDATE}`,
  )
  async updateRequestReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    this.logger.log(`Proxying PUT /request-rewards/${id} request`);
    return await this.handleRequest(
      req,
      res,
      body,
      req.query,
      req.user as AuthenticatedUserPayload,
      req.headers,
    );
  }

  @Delete('request-rewards/:id')
  @RequirePermissions(
    `${ResourceType.REQUEST_REWARD}:${PermissionAction.DELETE}`,
  )
  async deleteRequestReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.logger.log(`Proxying DELETE /request-rewards/${id} request`);
    return await this.handleRequest(
      req,
      res,
      null,
      req.query,
      req.user as AuthenticatedUserPayload,
      req.headers,
    );
  }

  private async handleRequest(
    req: AuthenticatedRequest,
    res: Response,
    body: any,
    queryParams: any,
    user?: AuthenticatedUserPayload,
    requestHeaders?: any,
  ) {
    try {
      const serviceResponse = await this.proxyService.forwardRequest(
        req.method as any,
        req.path,
        body,
        queryParams,
        user,
        requestHeaders,
      );

      // Forward all response headers
      if (serviceResponse.headers) {
        Object.entries(serviceResponse.headers).forEach(([key, value]) => {
          // Skip setting Content-Length as it will be set automatically
          if (key.toLowerCase() !== 'content-length') {
            res.setHeader(key, value);
          }
        });
      }

      res.status(serviceResponse.status).json(serviceResponse.data);
    } catch (error) {
      this.logger.error(
        `Error in event proxy controller for ${req.path}: ${error.message}`,
        error.stack,
      );

      if (error.status && error.data) {
        res.status(error.status).json(error.data);
      } else if (error.response && error.response.status) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({
          message: 'Error proxying request',
          details: error.message,
        });
      }
    }
  }
}
