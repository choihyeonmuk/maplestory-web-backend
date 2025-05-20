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
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user?: AuthenticatedUserPayload;
  query: any;
  headers: any;
}
import { ProxyService } from './proxy.service';
import { handleProxyRequest } from './common-proxy.util';
import { AuthenticatedUserPayload } from '../auth/strategies/gateway-jwt.strategy';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Controller()
export class EventProxyController {
  private readonly authServerUrl: string;

  constructor(
    private readonly proxyService: ProxyService,
    private readonly configService: ConfigService,
  ) {
    this.authServerUrl = this.configService.get<string>('AUTH_SERVER_URL');
  }

  private async checkPermission(
    role: string | undefined,
    permission: string,
  ): Promise<boolean> {
    if (!role) return false;
    try {
      const resp = await axios.post(
        `${this.authServerUrl}/auth/permission/check`,
        { role, permission },
      );

      return !!resp.data.allowed;
    } catch (e) {
      console.error('Permission check failed', e);
      return false;
    }
  }

  /**
   * Check if a user has the required permission and return appropriate response if not
   * @param user The authenticated user
   * @param permission The required permission (format: 'resource:action')
   * @param res The response object to return error if needed
   * @returns true if the user has permission, otherwise sends a 401 response and returns false
   */
  private async checkUserPermission(
    user: AuthenticatedUserPayload | undefined,
    permission: string,
    res: Response,
  ): Promise<boolean> {
    const allowed = await this.checkPermission(user?.role, permission);
    if (!allowed) {
      res.status(401).json({ message: 'Insufficient permissions' });
      return false;
    }
    return true;
  }

  @Get('events')
  async getEvents(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;
    if (!(await this.checkUserPermission(user, 'event:read', res))) {
      return;
    }
    return await handleProxyRequest({
      req,
      res,
      body: null,
      queryParams: query,
      user: req.user as AuthenticatedUserPayload,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Get('events/:id')
  async getEventById(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const user = req.user as AuthenticatedUserPayload;
    if (!(await this.checkUserPermission(user, 'event:read', res))) {
      return;
    }
    return await handleProxyRequest({
      req,
      res,
      body: null,
      queryParams: req.query,
      user: req.user as AuthenticatedUserPayload,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Post('events')
  async createEvent(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;
    if (!(await this.checkUserPermission(user, 'event:create', res))) {
      return;
    }

    return await handleProxyRequest({
      req,
      res,
      body,
      queryParams: req.query,
      user: req.user as AuthenticatedUserPayload,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Put('events/:id')
  async updateEvent(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;
    if (!(await this.checkUserPermission(user, 'event:update', res))) {
      return;
    }
    return await handleProxyRequest({
      req,
      res,
      body,
      queryParams: req.query,
      user: req.user as AuthenticatedUserPayload,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Delete('events/:id')
  async deleteEvent(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const user = req.user as AuthenticatedUserPayload;
    if (!(await this.checkUserPermission(user, 'event:delete', res))) {
      return;
    }
    return await handleProxyRequest({
      req,
      res,
      body: null,
      queryParams: req.query,
      user: req.user as AuthenticatedUserPayload,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  // Reward endpoints
  @Get('rewards')
  async getRewards(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;
    if (!(await this.checkUserPermission(user, 'reward:read', res))) {
      return;
    }
    return await handleProxyRequest({
      req,
      res,
      body: null,
      queryParams: query,
      user: req.user as AuthenticatedUserPayload,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Get('rewards/:id')
  async getRewardById(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const user = req.user as AuthenticatedUserPayload;
    if (!(await this.checkUserPermission(user, 'reward:read', res))) {
      return;
    }
    return await handleProxyRequest({
      req,
      res,
      body: null,
      queryParams: req.query,
      user: req.user as AuthenticatedUserPayload,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Post('rewards')
  async createReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;

    const allowed = await this.checkPermission(user?.role, 'reward:create');
    if (!allowed) {
      return res.status(401).json({ message: 'Insufficient permissions' });
    }
    return await handleProxyRequest({
      req,
      res,
      body,
      queryParams: req.query,
      user: req.user as AuthenticatedUserPayload,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Put('rewards/:id')
  async updateReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;

    const allowed = await this.checkPermission(user?.role, 'reward:update');
    if (!allowed) {
      return res.status(401).json({ message: 'Insufficient permissions' });
    }
    return await handleProxyRequest({
      req,
      res,
      body,
      queryParams: req.query,
      user: req.user as AuthenticatedUserPayload,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Delete('rewards/:id')
  async deleteReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const user = req.user as AuthenticatedUserPayload;

    const allowed = await this.checkPermission(user?.role, 'reward:delete');
    if (!allowed) {
      return res.status(401).json({ message: 'Insufficient permissions' });
    }
    return await handleProxyRequest({
      req,
      res,
      body: null,
      queryParams: req.query,
      user: req.user as AuthenticatedUserPayload,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  // Request-Reward endpoints
  @Get('request-rewards')
  async getRequestRewards(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;

    // For users with only READ_OWN permission, filter to only return their own requests
    if (user && user.role === 'user') {
      if (!query) query = {};
      query.userId = user.sub; // Add user ID filter to the query
    }

    return await handleProxyRequest({
      req,
      res,
      body: null,
      queryParams: query,
      user,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Get('request-rewards/:id')
  async getRequestRewardById(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const user = req.user as AuthenticatedUserPayload;
    // Regular users can only view their own request-rewards, others can view all
    if (user && user.role === 'user') {
      // We'll let the backend validate if this request belongs to the user
      // The backend should check the user ID from the headers
    }

    return await handleProxyRequest({
      req,
      res,
      body: null,
      queryParams: req.query,
      user,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Post('request-rewards')
  async createRequestReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;

    // 권한 체크
    const allowed = await this.checkPermission(
      user?.role,
      'request_reward:create',
    );
    if (!allowed) {
      return res.status(401).json({ message: 'Insufficient permissions' });
    }

    // Ensure the request is associated with the current user if they are a regular user
    if (user && user.role === 'user') {
      body.userId = user.sub;
    }

    return await handleProxyRequest({
      req,
      res,
      body,
      queryParams: req.query,
      user,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Put('request-rewards/:id')
  async updateRequestReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    // 권한 체크
    const user = req.user as AuthenticatedUserPayload;
    const allowed = await this.checkPermission(
      user?.role,
      'request_reward:update',
    );
    if (!allowed) {
      return res.status(401).json({ message: 'Insufficient permissions' });
    }
    return await handleProxyRequest({
      req,
      res,
      body,
      queryParams: req.query,
      user: req.user as AuthenticatedUserPayload,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Delete('request-rewards/:id')
  async deleteRequestReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    // 권한 체크
    const user = req.user as AuthenticatedUserPayload;
    const allowed = await this.checkPermission(
      user?.role,
      'request_reward:delete',
    );
    if (!allowed) {
      return res.status(401).json({ message: 'Insufficient permissions' });
    }
    return await handleProxyRequest({
      req,
      res,
      body: null,
      queryParams: req.query,
      user: req.user as AuthenticatedUserPayload,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  // 출석 이벤트를 위한 컨트롤러
  @Post('attendance')
  async recordAttendance(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: any,
  ) {
    // 권한 체크
    const user = req.user as AuthenticatedUserPayload;
    return await handleProxyRequest({
      req,
      res,
      body,
      queryParams: req.query,
      user,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }
}
