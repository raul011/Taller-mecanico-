import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url, user } = req;
        const now = Date.now();

        return next
            .handle()
            .pipe(
                tap(() => {
                    const userId = user ? user.id : 'Anonymous';
                    const role = user ? user.roles : 'None';
                    this.logger.log(
                        `[${method}] ${url} - User: ${userId} (${role}) - ${Date.now() - now}ms`,
                    );
                }),
            );
    }
}
