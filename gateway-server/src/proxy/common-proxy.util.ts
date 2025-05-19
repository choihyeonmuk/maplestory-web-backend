import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { AuthenticatedUserPayload } from '../auth/strategies/gateway-jwt.strategy';

/**
 * 일관된 프록시 요청 처리를 위한 유틸 함수. (컨트롤러 공용)
 */
export async function handleProxyRequest({
  req,
  res,
  body,
  queryParams,
  user,
  requestHeaders,
  proxyService,
  controllerName,
}: {
  req: any;
  res: Response;
  body: any;
  queryParams: any;
  user?: AuthenticatedUserPayload;
  requestHeaders?: any;
  proxyService: ProxyService;
  controllerName: string;
}) {
  try {
    const serviceResponse = await proxyService.forwardRequest(
      req.method,
      req.path,
      body,
      queryParams,
      user,
      requestHeaders,
    );
    // Forward all response headers
    if (serviceResponse.headers) {
      Object.entries(serviceResponse.headers).forEach(([key, value]) => {
        if (key.toLowerCase() !== 'content-length') {
          res.setHeader(key, value as string);
        }
      });
    }
    res.status(serviceResponse.status).json(serviceResponse.data);
  } catch (error: any) {
    console.error(
      `Error in ${controllerName} for ${req.path}: ${error.message}`,
      error.stack,
    );
    if (error.status && error.data) {
      res.status(error.status).json(error.data);
    } else if (error.response && error.response.status) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error proxying request',
        details: error.message,
      });
    }
  }
}
