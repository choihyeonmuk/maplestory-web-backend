import { Controller, Post, Req, Res, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { Public } from '../auth/decorators/public.decorator';
import { handleProxyRequest } from './common-proxy.util';

@ApiTags('auth')
@Controller('auth')
export class AuthProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  // User authentication endpoints
  @Public()
  @Post('user/register')
  @ApiOperation({
    summary: '사용자 회원가입',
    description: '새로운 사용자를 등록합니다.',
  })
  @ApiBody({ schema: { type: 'object' } })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '사용자가 성공적으로 등록되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터',
  })
  async proxyUserRegister(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    return await handleProxyRequest({
      req,
      res,
      body,
      queryParams: req.query,
      user: undefined,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Public()
  @Post('user/login')
  @ApiOperation({
    summary: '사용자 로그인',
    description: '사용자 계정으로 로그인합니다.',
  })
  @ApiBody({ schema: { type: 'object' } })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 성공',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패',
  })
  async proxyUserLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    return await handleProxyRequest({
      req,
      res,
      body,
      queryParams: req.query,
      user: undefined,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  // Staff authentication endpoints
  @Public()
  @Post('staff/register')
  @ApiOperation({
    summary: '직원 회원가입',
    description: '새로운 직원을 등록합니다.',
  })
  @ApiBody({ schema: { type: 'object' } })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '직원이 성공적으로 등록되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청 데이터',
  })
  async proxyStaffRegister(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    return await handleProxyRequest({
      req,
      res,
      body,
      queryParams: req.query,
      user: undefined,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  @Public()
  @Post('staff/login')
  @ApiOperation({
    summary: '직원 로그인',
    description: '직원 계정으로 로그인합니다.',
  })
  @ApiBody({ schema: { type: 'object' } })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 성공',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '인증 실패',
  })
  async proxyStaffLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    return await handleProxyRequest({
      req,
      res,
      body,
      queryParams: req.query,
      user: undefined,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }

  // For verifying user or staff tokens
  @Public()
  @Post('verify/:userId')
  @ApiOperation({
    summary: '사용자 토큰 검증',
    description: '사용자 또는 직원의 토큰을 검증합니다.',
  })
  @ApiBody({ schema: { type: 'object' } })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '토큰 검증 성공',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '유효하지 않은 토큰',
  })
  async proxyVerifyUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    return await handleProxyRequest({
      req,
      res,
      body,
      queryParams: req.query,
      user: undefined,
      requestHeaders: req.headers,
      proxyService: this.proxyService,
    });
  }
}
