import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Req,
  Res,
  Param,
  Body,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
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

@ApiTags('events')
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
  @ApiOperation({
    summary: '모든 이벤트 조회',
    description: '등록된 모든 이벤트 목록을 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트 목록 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '권한 부족',
  })
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
  @ApiOperation({
    summary: '특정 이벤트 조회',
    description: 'ID로 특정 이벤트를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '이벤트 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '권한 부족',
  })
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
  @ApiOperation({
    summary: '이벤트 생성',
    description: '새로운 이벤트를 생성합니다.',
  })
  @ApiBody({ schema: { type: 'object' } })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '이벤트가 성공적으로 생성되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '권한 부족',
  })
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
  @ApiOperation({
    summary: '이벤트 수정',
    description: '특정 이벤트의 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '이벤트 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiBody({ schema: { type: 'object' } })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이벤트 수정 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '권한 부족',
  })
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
  @ApiOperation({
    summary: '이벤트 삭제',
    description: '특정 이벤트를 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '이벤트 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '이벤트 삭제 성공' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이벤트를 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '권한 부족',
  })
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
  @ApiOperation({
    summary: '보상 목록 조회',
    description: '등록된 모든 보상 목록을 조회하거나 특정 이벤트의 보상만 필터링하여 조회합니다.',
  })
  @ApiQuery({
    name: 'eventId',
    description: '특정 이벤트 ID로 보상 필터링',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 목록 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '권한 부족',
  })
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
  @ApiOperation({
    summary: '특정 보상 조회',
    description: 'ID로 특정 보상을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '보상 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상을 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '권한 부족',
  })
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
  @ApiOperation({
    summary: '보상 생성',
    description: '새로운 보상을 생성합니다.',
  })
  @ApiBody({ schema: { type: 'object' } })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '보상이 성공적으로 생성되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '권한 부족',
  })
  async createReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;

    if (!(await this.checkUserPermission(user, 'reward:create', res))) {
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

  @Put('rewards/:id')
  @ApiOperation({
    summary: '보상 수정',
    description: '특정 보상의 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '보상 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiBody({ schema: { type: 'object' } })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 수정 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상을 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '권한 부족',
  })
  async updateReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;

    if (!(await this.checkUserPermission(user, 'reward:update', res))) {
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

  @Delete('rewards/:id')
  @ApiOperation({
    summary: '보상 삭제',
    description: '특정 보상을 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '보상 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 삭제 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상을 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '권한 부족',
  })
  async deleteReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const user = req.user as AuthenticatedUserPayload;

    if (!(await this.checkUserPermission(user, 'reward:delete', res))) {
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

  // Request-Reward endpoints
  @Get('request-rewards')
  @ApiOperation({
    summary: '보상 요청 목록 조회',
    description: '모든 보상 요청 목록을 조회합니다. 필터링이 가능합니다.',
  })
  @ApiQuery({
    name: 'userId',
    description: '사용자 ID 필터',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'eventId',
    description: '이벤트 ID 필터',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 요청 목록 조회 성공',
  })
  async getRequestRewards(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;

    if (!(await this.checkUserPermission(user, 'request_reward:read', res))) {
      return;
    }
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
  @ApiOperation({
    summary: '특정 보상 요청 조회',
    description: 'ID로 특정 보상 요청을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '보상 요청 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 요청 조회 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상 요청을 찾을 수 없음',
  })
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
  @ApiOperation({
    summary: '이벤트 보상 요청',
    description: '사용자가 이벤트 보상을 요청합니다.',
  })
  @ApiBody({ schema: { type: 'object' } })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '보상 요청이 성공적으로 생성되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터 또는 이미 처리된 요청',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '권한 부족',
  })
  async createRequestReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const user = req.user as AuthenticatedUserPayload;
    if (!(await this.checkUserPermission(user, 'request_reward:create', res))) {
      return;
    }

    // Ensure the request is associated with the current user if they are a regular user
    body.user = user.sub;

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
  @ApiOperation({
    summary: '보상 요청 수정',
    description: '특정 보상 요청을 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '보상 요청 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiBody({ schema: { type: 'object' } })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 요청 수정 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상 요청을 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 또는 이미 처리된 요청',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '권한 부족',
  })
  async updateRequestReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    // 권한 체크
    const user = req.user as AuthenticatedUserPayload;
    if (!(await this.checkUserPermission(user, 'request_reward:update', res))) {
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

  @Delete('request-rewards/:id')
  @ApiOperation({
    summary: '보상 요청 삭제',
    description: '특정 보상 요청을 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '보상 요청 ID',
    example: '64a12345b789c12345d67890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 요청 삭제 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상 요청을 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '권한 부족',
  })
  async deleteRequestReward(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    // 권한 체크
    const user = req.user as AuthenticatedUserPayload;
    if (!(await this.checkUserPermission(user, 'request_reward:delete', res))) {
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

  @Patch('request-rewards/process')
  @ApiOperation({
    summary: '보상 요청 수동 처리',
    description: '운영자 또는 관리자가 보상 요청을 수동으로 처리합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보상 요청이 성공적으로 처리되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '보상 요청을 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 또는 이미 처리된 요청',
  })
  async processRequest(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: any,
  ) {
    // 권한 체크
    const user = req.user as AuthenticatedUserPayload;
    if (!(await this.checkUserPermission(user, 'request_reward:update', res))) {
      return;
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

  // 출석 이벤트를 위한 컨트롤러
  @Post('attendance')
  @ApiOperation({
    summary: '출석 기록',
    description: '사용자의 출석을 기록합니다.',
  })
  @ApiBody({
    description: '출석 기록 데이터',
    schema: null,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '출석이 성공적으로 기록되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터',
  })
  async recordAttendance(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Body() body: any,
  ) {
    // 권한 체크
    const user = req.user as AuthenticatedUserPayload;

    // 직접 userId를 body에 할당
    body.userId = user.sub;

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
