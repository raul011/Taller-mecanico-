import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define como se guarda un log en MongoDB 

@Schema({ timestamps: true })
export class Log extends Document {
    @Prop({ required: true })
    action: string; // CREATE, UPDATE, DELETE, LOGIN

    @Prop({ required: true })
    entity: string; // order, vehicle, client

    @Prop()
    entityId?: number;

    @Prop()
    user?: string;

    @Prop()
    description?: string;

    @Prop()
    ip?: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
