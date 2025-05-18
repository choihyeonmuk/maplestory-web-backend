import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyController } from './proxy.controller';
import { EventProxyController } from './event-proxy.controller';
import { ProxyService } from './proxy.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule.register({}), AuthModule],
  controllers: [ProxyController, EventProxyController],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule {}
