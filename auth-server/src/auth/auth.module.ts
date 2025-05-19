import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from '../schemas/user.schema';
import { Staff, StaffSchema } from '../schemas/staff.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { Permission, PermissionSchema } from '../schemas/permission.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [AuthController, PermissionController],
  providers: [AuthService, AuthRepository, PermissionService],
  exports: [AuthService, PermissionService],
})
export class AuthModule {}
