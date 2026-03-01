import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { LogsService } from './logs.service';

//expone el CRUD por HTTP
@Controller('logs')
export class LogsController {
    constructor(private service: LogsService) { }

    @Post()
    create(@Body() body) {
        return this.service.create(body);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.service.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
