import { Module } from '@nestjs/common';
import { ServiciosTrabajoService } from './servicios-trabajo.service';
import { ServiciosTrabajoController } from './servicios-trabajo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiciosTrabajo } from './entities/servicios-trabajo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiciosTrabajo])],
  controllers: [ServiciosTrabajoController],
  providers: [ServiciosTrabajoService],
  exports: [TypeOrmModule],
})
export class ServiciosTrabajoModule { }
