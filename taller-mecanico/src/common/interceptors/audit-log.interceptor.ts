import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogsService } from '../../logs/logs.service';
import { AUDIT_LOG_KEY } from '../decorators/audit-log.decorator';
import type { AuditMetadata } from '../interfaces/audit-metadata.interface';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly logsService: LogsService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const auditMetadata = this.reflector.get<AuditMetadata>(
            AUDIT_LOG_KEY,
            context.getHandler(),
        );

        if (!auditMetadata) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const userObj = request.user;
        const user = userObj
            ? `${userObj.fullName} (${userObj.email})`
            : 'unknown';
        const ip = request.ip || request.connection?.remoteAddress || 'unknown';

        return next.handle().pipe(
            tap(async (result) => {
                try {
                    const entityId = result?.id || result?._id || undefined;
                    const description = auditMetadata.description
                        ? auditMetadata.description(result)
                        : `${auditMetadata.action} en ${auditMetadata.entity}`;

                    await this.logsService.create({
                        action: auditMetadata.action,
                        entity: auditMetadata.entity,
                        entityId,
                        user,
                        description,
                        ip,
                    });
                } catch (error) {
                    // Log error but don't fail the request
                    console.error('Error creating audit log:', error);
                }
            }),
        );
    }
}
