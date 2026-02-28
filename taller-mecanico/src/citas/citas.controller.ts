import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto, UpdateCitaDto } from './dto/cita.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('citas')
@UseGuards(AuthGuard('jwt'))
export class CitasController {
    constructor(private readonly citasService: CitasService) { }

    @Post()
    create(@Body() createCitaDto: CreateCitaDto) {
        return this.citasService.create(createCitaDto);
    }

    @Get()
    findAll(@Query('start') start?: string, @Query('end') end?: string) {
        return this.citasService.findAll(start, end);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.citasService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
        return this.citasService.update(+id, updateCitaDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.citasService.remove(+id);
    }
}
