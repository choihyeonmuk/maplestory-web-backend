import {
  Controller,
  Post,
  Req,
  Res,
  Logger,
  Body,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { Public } from '../auth/decorators/public.decorator';
import { handleProxyRequest } from './common-proxy.util';

@Controller()
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  constructor(private readonly proxyService: ProxyService) {}

  @Public()
  @Post('auth/register')
  async proxyAuthRegister(
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
      logger: this.logger,
      controllerName: 'ProxyController',
    });
  }

  @Public()
  @Post('auth/login')
  async proxyAuthLogin(
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
      logger: this.logger,
      controllerName: 'ProxyController',
    });
  }
}
