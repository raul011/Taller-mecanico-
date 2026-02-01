import { IsNumber, IsString, IsOptional, IsEnum, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// import { ItemType, OrderStatus } from '../entities/orden-trabajo.entity';

// Since I put ItemType in item entity and Status in order entity, let's adjust imports if needed or rely on exports
// In entity file I used 'export enum' so I can import them.

// Re-exporting enums for DTO usage convenience if they are not in separate file
export { ItemType } from '../entities/orden-item.entity';
export { OrderStatus } from '../entities/orden-trabajo.entity';

import { ItemType as IType } from '../entities/orden-item.entity';
import { OrderStatus as OStatus } from '../entities/orden-trabajo.entity';

export class CreateOrdenItemDto {
    @IsEnum(IType)
    type: IType;

    @IsNumber()
    itemId: number;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrdenTrabajoDto {
    @IsNumber()
    autoId: number;

    @IsString()
    @IsOptional()
    mechanicId?: string; // User Id

    @IsString()
    @IsOptional()
    observaciones?: string;
}

export class AddItemDto extends CreateOrdenItemDto { }

export class UpdateStatusDto {
    @IsEnum(OStatus)
    status: OStatus;
}
