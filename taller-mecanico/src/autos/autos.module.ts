import { Module } from '@nestjs/common';
import { AutosService } from './autos.service';
import { AutosController } from './autos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auto } from './entities/auto.entity';
import { ClientesModule } from '../clientes/clientes.module';
import { Cliente } from '../clientes/entities/cliente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auto, Cliente]), // Import Cliente entity repo or import module exporting it
    ClientesModule // To use Client Service if needed, but since we use Repository directly, TypeOrmModule.forFeature is enough
  ],
  controllers: [AutosController],
  providers: [AutosService],
  exports: [TypeOrmModule] // Export for Work Orders
})
export class AutosModule { }
