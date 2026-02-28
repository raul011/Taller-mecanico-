import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { OrdenTrabajo, OrderStatus } from './entities/orden-trabajo.entity';
import { OrdenItem, ItemType } from './entities/orden-item.entity';
import { CreateOrdenTrabajoDto, CreateOrdenItemDto } from './dto/create-orden-trabajo.dto';
import { Auto } from '../autos/entities/auto.entity';
import { User } from '../users/entities/user.entity';
import { ServiciosTrabajo } from '../servicios-trabajo/entities/servicios-trabajo.entity';
import { Repuesto } from '../repuestos/entities/repuesto.entity';

@Injectable()
export class OrdenTrabajoService {
  private readonly logger = new Logger('OrdenTrabajoService');

  constructor(
    @InjectRepository(OrdenTrabajo)
    private readonly ordenRepository: Repository<OrdenTrabajo>,
    @InjectRepository(OrdenItem)
    private readonly itemRepository: Repository<OrdenItem>,
    @InjectRepository(Auto)
    private readonly autoRepository: Repository<Auto>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ServiciosTrabajo)
    private readonly servicioRepository: Repository<ServiciosTrabajo>,
    @InjectRepository(Repuesto)
    private readonly repuestoRepository: Repository<Repuesto>,
    private readonly dataSource: DataSource,
  ) { }

  async create(createOrdenDto: CreateOrdenTrabajoDto) {
    const { autoId, mechanicId, observaciones } = createOrdenDto;

    const auto = await this.autoRepository.findOneBy({ id: autoId });
    if (!auto) throw new NotFoundException('Auto not found');

    let mechanic: User | undefined = undefined;
    if (mechanicId) {
      mechanic = (await this.userRepository.findOneBy({ id: mechanicId })) || undefined;
      if (!mechanic) throw new NotFoundException('Mechanic not found');
    }

    const orden = this.ordenRepository.create({
      auto,
      mechanic,
      observaciones,
      status: OrderStatus.PENDING,
      total: 0,
    });

    return this.ordenRepository.save(orden);
  }

  async findAll(filters: { clientId?: number; autoId?: number; date?: string } = {}) {
    const { clientId, autoId, date } = filters;
    const where: any = {};

    if (autoId) where.auto = { id: autoId };
    if (clientId) where.auto = { ...where.auto, cliente: { id: clientId } };
    if (date) {
      // Simple date filter (exact match for now, ideally range)
      // where.dateIn = date; 
      // For simplicity in this iteration let's skip complex date logic or use Between
    }

    return this.ordenRepository.find({
      where,
      relations: ['auto', 'auto.cliente', 'items', 'mechanic'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number) {
    const orden = await this.ordenRepository.findOne({
      where: { id },
      relations: ['auto', 'auto.cliente', 'items', 'mechanic'],
    });
    if (!orden) throw new NotFoundException(`Order ${id} not found`);
    return orden;
  }

  async addItem(ordenId: number, itemDto: CreateOrdenItemDto) {
    const orden = await this.findOne(ordenId);
    if (orden.status === OrderStatus.FINISHED || orden.status === OrderStatus.PAID) {
      throw new BadRequestException('Cannot add items to finished/paid order');
    }

    let itemName = '';
    let unitPrice = 0;

    if (itemDto.type === ItemType.SERVICE) {
      const service = await this.servicioRepository.findOneBy({ id: itemDto.itemId });
      if (!service) throw new NotFoundException('Service not found');
      itemName = service.descripcion;
      unitPrice = service.costo;
    } else {
      const repuesto = await this.repuestoRepository.findOneBy({ id: itemDto.itemId });
      if (!repuesto) throw new NotFoundException('Repuesto not found');
      if (repuesto.stock < itemDto.quantity) {
        throw new BadRequestException(`Not enough stock for ${repuesto.nombre}. Available: ${repuesto.stock}`);
      }
      itemName = repuesto.nombre;
      unitPrice = repuesto.precioVenta;

      // Decrease stock
      repuesto.stock -= itemDto.quantity;
      await this.repuestoRepository.save(repuesto);
    }

    // Use custom price/name if provided, otherwise use defaults
    if (itemDto.customName) itemName = itemDto.customName;
    if (itemDto.customPrice !== undefined) unitPrice = itemDto.customPrice;

    const totalPrice = unitPrice * itemDto.quantity;

    const item = this.itemRepository.create({
      type: itemDto.type,
      itemId: itemDto.itemId,
      itemName,
      quantity: itemDto.quantity,
      unitPrice,
      totalPrice,
      orden,
    });

    // Save item - TypeORM commits automatically
    const savedItem = await this.itemRepository.save(item);

    // Update Order Total
    await this.recalculateOrderTotal(ordenId);

    // Auto status update
    if (orden.status === OrderStatus.PENDING) {
      await this.ordenRepository.update(ordenId, { status: OrderStatus.IN_PROGRESS });
    }

    // Query for updated order
    return this.ordenRepository
      .createQueryBuilder('orden')
      .leftJoinAndSelect('orden.auto', 'auto')
      .leftJoinAndSelect('auto.cliente', 'cliente')
      .leftJoinAndSelect('orden.items', 'items')
      .leftJoinAndSelect('orden.mechanic', 'mechanic')
      .where('orden.id = :id', { id: ordenId })
      .getOne();
  }

  async updateItem(ordenId: number, itemId: number, updateDto: CreateOrdenItemDto) {
    const orden = await this.findOne(ordenId);
    if (orden.status === OrderStatus.FINISHED || orden.status === OrderStatus.PAID) {
      throw new BadRequestException('Cannot update items in finished/paid order');
    }

    const item = await this.itemRepository.findOneBy({ id: itemId, orden: { id: ordenId } });
    if (!item) throw new NotFoundException('Item not found');

    // Handle stock changes if quantity changes for parts
    if (item.type === ItemType.PART && updateDto.quantity !== item.quantity) {
      const repuesto = await this.repuestoRepository.findOneBy({ id: item.itemId });
      if (repuesto) {
        const diff = updateDto.quantity - item.quantity;
        if (repuesto.stock < diff) {
          throw new BadRequestException(`Not enough stock. Available: ${repuesto.stock}`);
        }
        repuesto.stock -= diff;
        await this.repuestoRepository.save(repuesto);
      }
    }

    // Update fields
    item.quantity = updateDto.quantity;
    if (updateDto.customName) item.itemName = updateDto.customName;
    if (updateDto.customPrice !== undefined) item.unitPrice = updateDto.customPrice;

    // Recalculate total
    item.totalPrice = item.unitPrice * item.quantity;

    await this.itemRepository.save(item);
    await this.recalculateOrderTotal(ordenId);

    return this.findOne(ordenId);
  }

  private async recalculateOrderTotal(ordenId: number) {
    const orden = await this.ordenRepository.findOne({
      where: { id: ordenId },
      relations: ['items']
    });
    if (orden) {
      const total = orden.items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
      orden.total = total;
      await this.ordenRepository.save(orden);
    }
  }

  async removeItem(ordenId: number, itemId: number) {
    const orden = await this.findOne(ordenId);
    if (orden.status === OrderStatus.FINISHED || orden.status === OrderStatus.PAID) {
      throw new BadRequestException('Cannot remove items from finished/paid order');
    }

    const item = await this.itemRepository.findOneBy({ id: itemId, orden: { id: ordenId } });
    if (!item) throw new NotFoundException('Item not found in this order');

    // Restore Stock if it's a PART
    if (item.type === ItemType.PART) {
      const repuesto = await this.repuestoRepository.findOneBy({ id: item.itemId });
      if (repuesto) {
        repuesto.stock += item.quantity;
        await this.repuestoRepository.save(repuesto);
      }
    }

    await this.itemRepository.remove(item);
    await this.recalculateOrderTotal(ordenId);

    // Use QueryBuilder to bypass all caching
    const freshOrder = await this.ordenRepository
      .createQueryBuilder('orden')
      .leftJoinAndSelect('orden.auto', 'auto')
      .leftJoinAndSelect('auto.cliente', 'cliente')
      .leftJoinAndSelect('orden.items', 'items')
      .leftJoinAndSelect('orden.mechanic', 'mechanic')
      .where('orden.id = :id', { id: ordenId })
      .getOne();

    return freshOrder;
  }

  async changeStatus(id: number, status: OrderStatus) {
    const orden = await this.findOne(id);
    orden.status = status;
    if (status === OrderStatus.FINISHED && !orden.dateOut) {
      orden.dateOut = new Date();
    }
    return this.ordenRepository.save(orden);
  }
}
