import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import configurationConfig from 'src/config/configuration.config';
import { UsersService } from 'src/users/services/users.service';
import { CustomHttpException } from 'src/common/helpers/custom.exception';
import { JwtPayload } from '../types/payload.types';

const configService = new ConfigService(configurationConfig());

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOneById(payload.userId, false);
    if (!user) {
      throw new CustomHttpException('INVALID_TOKEN', HttpStatus.BAD_REQUEST);
    }

    return user;
  }
}
