import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../entities/users.entity';
import { RoleType } from '../types/role-type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!allowedRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user) {
      Logger.warn('User not found from request context');
      return false;
    }

    return this.matchRoles(allowedRoles, user.role.name.toUpperCase());
  }

  matchRoles(allowedRoles: string[], userRole: string) {
    if (userRole === RoleType.ADMINISTRATOR) {
      return true;
    }

    const rolesHierarchy = {
      [RoleType.READ_ONLY]: [RoleType.READ_ONLY],
    };

    return allowedRoles.some((allowedRole) => Object.values((rolesHierarchy as any)[userRole]).includes(allowedRole));
  }
}
