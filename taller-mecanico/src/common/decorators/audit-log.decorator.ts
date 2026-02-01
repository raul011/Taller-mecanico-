import { SetMetadata } from '@nestjs/common';
import type { AuditMetadata } from '../interfaces/audit-metadata.interface';

export const AUDIT_LOG_KEY = 'audit-log';

export const AuditLog = (metadata: AuditMetadata) =>
    SetMetadata(AUDIT_LOG_KEY, metadata);
