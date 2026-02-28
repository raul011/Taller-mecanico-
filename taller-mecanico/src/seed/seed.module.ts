import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ServiciosTrabajo } from '../servicios-trabajo/entities/servicios-trabajo.entity';
import { Repuesto } from '../repuestos/entities/repuesto.entity';

import { OrdenTrabajo } from '../orden-trabajo/entities/orden-trabajo.entity';
import { OrdenItem } from '../orden-trabajo/entities/orden-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ServiciosTrabajo, Repuesto, OrdenTrabajo, OrdenItem]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule { }
