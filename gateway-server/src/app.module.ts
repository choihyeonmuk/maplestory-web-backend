import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProxyModule } from './proxy/proxy.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    AuthModule,
    ProxyModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
