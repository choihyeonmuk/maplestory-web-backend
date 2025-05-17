import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Health check',
    description: 'Check if the server is running',
  })
  @Get('health')
  healthCheck(): string {
    return 'OK';
  }
}
