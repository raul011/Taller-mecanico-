import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../users/entities/user.entity';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }

import { META_ROLES } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const validRoles: string[] = this.reflector.get(
            META_ROLES,
            context.getHandler(),
        );

        if (!validRoles) return true;
        if (validRoles.length === 0) return true;

        const req = context.switchToHttp().getRequest();
        const user = req.user as User;

        if (!user) {
            throw new Error('User not found in request. Use AuthGuard before RolesGuard');
        }

        for (const role of user.roles) {
            if (validRoles.includes(role)) {
                return true;
            }
        }

        return false;
    }
}
