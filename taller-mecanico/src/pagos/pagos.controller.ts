import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('pagos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PagosController {
  constructor(private readonly pagosService: PagosService) { }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CASHIER)
  create(@Body() createPagoDto: CreatePagoDto) {
    return this.pagosService.create(createPagoDto);
  }

  @Get()
  findAll() {
    return this.pagosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pagosService.findOne(id);
  }
}
