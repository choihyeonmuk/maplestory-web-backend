import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiOperation({
    summary: 'Health check',
    description: 'Check if the server is running',
  })
  @Get('health')
  healthCheck(): string {
    return 'OK';
  }
}
