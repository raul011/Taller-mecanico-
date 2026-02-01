import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RepuestosService } from './repuestos.service';
import { CreateRepuestoDto } from './dto/create-repuesto.dto';
import { JwtAuthGuard } from '../auth/guards/roles.guard';

@Controller('repuestos')
@UseGuards(JwtAuthGuard)
export class RepuestosController {
  constructor(private readonly repuestosService: RepuestosService) { }

  @Post()
  create(@Body() createDto: CreateRepuestoDto) {
    return this.repuestosService.create(createDto);
  }

  @Get()
  findAll() {
    return this.repuestosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.repuestosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: CreateRepuestoDto) {
    return this.repuestosService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.repuestosService.remove(id);
  }
}
