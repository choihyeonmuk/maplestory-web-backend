import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthProxyController } from './auth-proxy.controller';
import { EventProxyController } from './event-proxy.controller';
import { ProxyService } from './proxy.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule.register({}), AuthModule],
  controllers: [AuthProxyController, EventProxyController],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
