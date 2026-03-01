import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './log.schema';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';

//conecta todo
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Log.name, schema: LogSchema },
        ]),
    ],
    providers: [LogsService],
    controllers: [LogsController],
    exports: [LogsService],  // esto hara que permita usarse desde otros modulos 
})
export class LogsModule { }
