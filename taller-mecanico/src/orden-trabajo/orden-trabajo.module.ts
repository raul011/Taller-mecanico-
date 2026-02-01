import { Module } from '@nestjs/common';
import { OrdenTrabajoService } from './orden-trabajo.service';
import { OrdenTrabajoController } from './orden-trabajo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';
import { OrdenItem } from './entities/orden-item.entity';
import { Auto } from '../autos/entities/auto.entity';
import { User } from '../users/entities/user.entity';
import { ServiciosTrabajo } from '../servicios-trabajo/entities/servicios-trabajo.entity';
import { Repuesto } from '../repuestos/entities/repuesto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdenTrabajo,
      OrdenItem,
      Auto,
      User,
      ServiciosTrabajo,
      Repuesto
    ])
  ],
  controllers: [OrdenTrabajoController],
  providers: [OrdenTrabajoService],
  exports: [OrdenTrabajoService]
})
export class OrdenTrabajoModule { }
