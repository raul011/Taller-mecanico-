import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './log.schema';

//Logica del CRUD
@Injectable()
export class LogsService {
    constructor(
        @InjectModel(Log.name)
        private logModel: Model<Log>,
    ) { }

    // CREATE
    create(data: Partial<Log>) {
        return this.logModel.create(data);
    }

    // READ ALL
    findAll() {
        return this.logModel.find().sort({ createdAt: -1 });
    }

    // READ ONE
    findById(id: string) {
        return this.logModel.findById(id);
    }

    // UPDATE
    update(id: string, data: Partial<Log>) {
        return this.logModel.findByIdAndUpdate(id, data, { new: true });
    }

    // DELETE
    remove(id: string) {
        return this.logModel.findByIdAndDelete(id);
    }
}
