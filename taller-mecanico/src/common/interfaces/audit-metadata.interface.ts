export interface AuditMetadata {
    action: string;
    entity: string;
    description?: (result: any) => string;
}
