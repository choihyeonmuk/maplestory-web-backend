import {
  Controller,
  Post,
  Req,
  Res,
  Logger,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { Public } from '../auth/decorators/public.decorator';
import { AuthenticatedUserPayload } from '../auth/strategies/gateway-jwt.strategy';

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
    return await this.handleRequest(
      req,
      res,
      body,
      req.query,
      undefined,
      req.headers,
    );
  }

  @Public()
  @Post('auth/login')
  async proxyAuthLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
  ) {
    return await this.handleRequest(
      req,
      res,
      body,
      req.query,
      undefined,
      req.headers,
    );
  }

  private async handleRequest(
    req: Request,
    res: Response,
    body: any,
    queryParams: any,
    user?: AuthenticatedUserPayload,
    requestHeaders?: any,
  ) {
    try {
      const serviceResponse = await this.proxyService.forwardRequest(
        req.method as any,
        req.path, // Use path instead of originalUrl to avoid query params duplication
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
        `Error in proxy controller for ${req.path}: ${error.message}`,
        error.stack,
      );

      if (error.status && error.data) {
        res.status(error.status).json(error.data);
      } else if (error.response && error.response.status) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error proxying request', details: error.message });
      }
    }
  }
}
