import { PartialType } from '@nestjs/mapped-types';
import { CreateServiciosTrabajoDto } from './create-servicios-trabajo.dto';

export class UpdateServiciosTrabajoDto extends PartialType(CreateServiciosTrabajoDto) {}
