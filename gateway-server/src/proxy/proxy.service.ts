import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { firstValueFrom } from 'rxjs';
import { AuthenticatedUserPayload } from '../auth/strategies/gateway-jwt.strategy';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
    this.logger.log(`Auth service URL configured as: ${this.authServiceUrl}`);
  }

  private getServiceUrl(servicePath: string): string | null {
    if (servicePath.startsWith('/auth')) {
      return this.authServiceUrl;
    }
    this.logger.warn(
      `No service configured for path prefix: ${servicePath.split('/')[1]}`,
    );
    return null;
  }

  async forwardRequest(
    method: Method,
    originalPath: string, // e.g., /auth/login, /events, /rewards/event/some-id
    data?: any,
    queryParams?: Record<string, any>,
    user?: AuthenticatedUserPayload, // Authenticated user from JWT
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<any>> {
    const normalizedPath = originalPath.startsWith('/')
      ? originalPath
      : `/${originalPath}`;

    const pathWithoutApiPrefix = normalizedPath.startsWith('/api/')
      ? normalizedPath.substring(4) // Remove /api prefix if present
      : normalizedPath;

    const servicePrefix = '/' + pathWithoutApiPrefix.split('/')[1]; // e.g., /auth, /events
    const downstreamPath =
      servicePrefix === '/auth'
        ? pathWithoutApiPrefix
        : pathWithoutApiPrefix.substring(servicePrefix.length || 1); // e.g., /login, "", /event/some-id

    const targetBaseUrl = this.getServiceUrl(servicePrefix);

    if (!targetBaseUrl) {
      this.logger.error(
        `No target service URL found for path: ${normalizedPath} (normalized to ${pathWithoutApiPrefix})`,
      );
      throw new Error(`Service not found for path: ${normalizedPath}`);
    }

    // Ensure the URL has a protocol
    const normalizedBaseUrl = targetBaseUrl.startsWith('http')
      ? targetBaseUrl
      : `http://${targetBaseUrl}`;

    const targetUrl = `${normalizedBaseUrl}${downstreamPath}`;
    this.logger.log(`Forwarding ${method} request to ${targetUrl}`);

    // Log request body for debugging
    if (data) {
      this.logger.log(`Request body: ${JSON.stringify(data)}`);
    }
    const cleanHeaders = { ...(headers || {}) };
    delete cleanHeaders['content-type'];
    delete cleanHeaders['Content-Type'];
    delete cleanHeaders['content-length'];
    delete cleanHeaders['Content-Length'];

    const requestConfig: AxiosRequestConfig = {
      method,
      url: targetUrl,
      data,
      params: queryParams,
      headers: cleanHeaders,
    };

    // If user is authenticated, pass user information to downstream services
    if (user && user.sub) {
      requestConfig.headers['x-user-id'] = user.sub;
      if (user.roles) {
        requestConfig.headers['x-user-roles'] = user.roles.join(',');
      }
      requestConfig.headers['x-user-name'] = user.username;
      this.logger.log(
        `Forwarding with user context: ID=${user.sub}, Roles=${user.roles?.join(',')}`,
      );
    }

    try {
      this.logger.log(`Starting HTTP request to ${targetUrl}`);
      const response = await firstValueFrom(
        this.httpService.request(requestConfig),
      );
      this.logger.log(
        `Successfully received response from ${targetUrl}, status: ${response.status}`,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Error forwarding request to ${targetUrl}: ${error.message}`,
        error.stack,
      );

      // More detailed error logging
      if (error.code) {
        this.logger.error(`Error code: ${error.code}`);
      }

      if (error.response) {
        this.logger.error(
          `Downstream service error details: Status=${error.response.status}, Data=${JSON.stringify(error.response.data)}`,
        );
        // Re-throw with downstream service error details
        throw {
          status: error.response.status,
          data: error.response.data,
          message: error.response.data?.message || error.message,
        };
      }
      throw new Error(
        `Failed to forward request to ${targetUrl}: ${error.message}`,
      );
    }
  }
}
