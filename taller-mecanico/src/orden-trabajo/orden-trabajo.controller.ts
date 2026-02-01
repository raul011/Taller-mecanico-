import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, UseGuards, Query, Delete } from '@nestjs/common';
import { OrdenTrabajoService } from './orden-trabajo.service';
import { CreateOrdenTrabajoDto, AddItemDto, UpdateStatusDto } from './dto/create-orden-trabajo.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('orden-trabajo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdenTrabajoController {
  constructor(private readonly ordenTrabajoService: OrdenTrabajoService) { }

  @Post()
  @Roles(UserRole.MECHANIC, UserRole.ADMIN)
  create(@Body() createDto: CreateOrdenTrabajoDto) {
    return this.ordenTrabajoService.create(createDto);
  }

  @Get()
  findAll(
    @Query('clientId') clientId?: number,
    @Query('autoId') autoId?: number,
  ) {
    return this.ordenTrabajoService.findAll({ clientId, autoId });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordenTrabajoService.findOne(id);
  }

  @Post(':id/items')
  @Roles(UserRole.MECHANIC, UserRole.ADMIN)
  addItem(@Param('id', ParseIntPipe) id: number, @Body() addItemDto: AddItemDto) {
    return this.ordenTrabajoService.addItem(id, addItemDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.MECHANIC, UserRole.ADMIN)
  changeStatus(@Param('id', ParseIntPipe) id: number, @Body() statusDto: UpdateStatusDto) {
    return this.ordenTrabajoService.changeStatus(id, statusDto.status);
  }

  @Delete(':id/items/:itemId')
  @Roles(UserRole.ADMIN) // Deletion restricted to Admin for safety
  removeItem(@Param('id', ParseIntPipe) id: number, @Param('itemId', ParseIntPipe) itemId: number) {
    return this.ordenTrabajoService.removeItem(id, itemId);
  }
}
