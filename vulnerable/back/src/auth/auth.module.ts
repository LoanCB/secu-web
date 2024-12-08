import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { ConfigService } from '@nestjs/config';
import configurationConfig from 'src/config/configuration.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './helpers/jwt.strategy';

const configService = new ConfigService(configurationConfig());

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: configService.get('secret'),
      signOptions: { expiresIn: `${configService.get('jwtTime')}s` },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
