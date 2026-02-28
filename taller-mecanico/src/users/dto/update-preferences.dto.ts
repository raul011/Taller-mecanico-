import { IsOptional, IsEnum, IsString, IsBoolean } from 'class-validator';

export class UpdatePreferencesDto {
    @IsOptional()
    @IsEnum(['light', 'dark'])
    theme?: 'light' | 'dark';

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsEnum(['es', 'en'])
    language?: 'es' | 'en';

    @IsOptional()
    @IsBoolean()
    notifications?: boolean;

    @IsOptional()
    @IsEnum(['grid', 'list'])
    dashboardLayout?: 'grid' | 'list';
}
