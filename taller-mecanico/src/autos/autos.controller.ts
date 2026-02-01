import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AutosService } from './autos.service';
import { CreateAutoDto } from './dto/create-auto.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { AuditLog } from '../common/decorators/audit-log.decorator';

@Controller('autos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AutosController {
  constructor(private readonly autosService: AutosService) { }

  @Post()
  @Roles(UserRole.MECHANIC, UserRole.ADMIN)
  @AuditLog({
    action: 'CREATE_AUTO',
    entity: 'auto',
    description: (result) => `Se creó auto ${result.placa} - ${result.marca} ${result.modelo}`,
  })
  create(@Body() createAutoDto: CreateAutoDto) {
    return this.autosService.create(createAutoDto);
  }

  @Get()
  findAll() {
    return this.autosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.autosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAutoDto: CreateAutoDto) {
    return this.autosService.update(id, updateAutoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.autosService.remove(id);
  }
}
