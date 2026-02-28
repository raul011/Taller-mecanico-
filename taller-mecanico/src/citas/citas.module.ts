import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { Cita } from './entities/cita.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Auto } from '../autos/entities/auto.entity';
import { User } from '../users/entities/user.entity'; // Keep user if needed for auth, but validation needs Cliente

@Module({
    imports: [TypeOrmModule.forFeature([Cita, Cliente, Auto, User])],
    controllers: [CitasController],
    providers: [CitasService],
    exports: [CitasService],
})
export class CitasModule { }
