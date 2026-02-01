import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ServiciosTrabajoService } from './servicios-trabajo.service';
import { CreateServiciosTrabajoDto } from './dto/create-servicios-trabajo.dto';
import { JwtAuthGuard } from '../auth/guards/roles.guard';

@Controller('servicios-trabajo')
@UseGuards(JwtAuthGuard)
export class ServiciosTrabajoController {
  constructor(private readonly serviciosTrabajoService: ServiciosTrabajoService) { }

  @Post()
  create(@Body() createDto: CreateServiciosTrabajoDto) {
    return this.serviciosTrabajoService.create(createDto);
  }

  @Get()
  findAll() {
    return this.serviciosTrabajoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosTrabajoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: CreateServiciosTrabajoDto) {
    return this.serviciosTrabajoService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviciosTrabajoService.remove(id);
  }
}
