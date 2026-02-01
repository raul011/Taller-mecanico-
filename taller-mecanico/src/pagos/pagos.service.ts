import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePagoDto } from './dto/create-pago.dto';
import { Pago } from './entities/pago.entity';
import { OrdenTrabajo, OrderStatus } from '../orden-trabajo/entities/orden-trabajo.entity';

@Injectable()
export class PagosService {
  private readonly logger = new Logger('PagosService');

  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(OrdenTrabajo)
    private readonly ordenRepository: Repository<OrdenTrabajo>,
  ) { }

  async create(createPagoDto: CreatePagoDto) {
    const orden = await this.ordenRepository.findOneBy({ id: createPagoDto.ordenId });
    if (!orden) throw new NotFoundException('Order not found');

    if (orden.status === OrderStatus.PAID)
      throw new BadRequestException('Order is already paid');

    const pago = this.pagoRepository.create({
      ...createPagoDto,
      orden,
    });

    await this.pagoRepository.save(pago);

    // Check if total covered
    // Note: simplificaiton, assuming one payment or multiple. Need to sum up.
    // For now, if payment >= total, mark as PAID.
    // Real implementation should sum all payments for this order.

    // Let's implement sum
    const totalPaid = await this.pagoRepository.sum('monto', {
      orden: { id: orden.id }
    });

    const paidAmount = totalPaid || 0;

    if (paidAmount >= orden.total) {
      orden.status = OrderStatus.PAID;
      await this.ordenRepository.save(orden);
    }

    return pago;
  }

  findAll() {
    return this.pagoRepository.find({ relations: { orden: true } });
  }

  async findOne(id: number) {
    const pago = await this.pagoRepository.findOne({
      where: { id },
      relations: { orden: true }
    });
    if (!pago) throw new NotFoundException(`Pago with id ${id} not found`);
    return pago;
  }
}
