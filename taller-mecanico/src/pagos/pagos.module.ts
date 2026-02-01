import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { OrdenTrabajo } from '../orden-trabajo/entities/orden-trabajo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, OrdenTrabajo])],
  controllers: [PagosController],
  providers: [PagosService]
})
export class PagosModule { }
