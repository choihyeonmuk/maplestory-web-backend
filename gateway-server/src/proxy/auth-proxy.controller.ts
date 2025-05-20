import { Controller, Post, Req, Res, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { Public } from '../auth/decorators/public.decorator';
import { handleProxyRequest } from './common-proxy.util';

@Controller('auth')
export class AuthProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  // User authentication endpoints
  @Public()
  @Post('user/register')
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
