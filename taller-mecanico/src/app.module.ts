import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientesModule } from './clientes/clientes.module';
import { AutosModule } from './autos/autos.module';
import { OrdenTrabajoModule } from './orden-trabajo/orden-trabajo.module';
import { ServiciosTrabajoModule } from './servicios-trabajo/servicios-trabajo.module';
import { RepuestosModule } from './repuestos/repuestos.module';
import { PagosModule } from './pagos/pagos.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeedModule } from './seed/seed.module';
import { LogsModule } from './logs/logs.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // SOLO desarrollo
    }),
    ClientesModule,
    AutosModule,
    OrdenTrabajoModule,
    ServiciosTrabajoModule,
    RepuestosModule,
    PagosModule,
    AuthModule,
    UsersModule,
    SeedModule,

    /*
    MongooseModule.forRoot('mongodb://localhost/taller-mecanico', {
      connectionName: 'DatabaseConnection', // Si estás usando múltiples conexiones
    }),
    */
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }), LogsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule { }
