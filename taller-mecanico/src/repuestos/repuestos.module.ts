import { Module } from '@nestjs/common';
import { RepuestosService } from './repuestos.service';
import { RepuestosController } from './repuestos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repuesto } from './entities/repuesto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Repuesto])],
  controllers: [RepuestosController],
  providers: [RepuestosService],
  exports: [TypeOrmModule, RepuestosService], // Export service for Order validation
})
export class RepuestosModule { }
