import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
// import { UpdateClienteDto } from './dto/update-cliente.dto'; // using same file for simplicity
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  private readonly logger = new Logger('ClientesService');

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) { }

  async create(createClienteDto: CreateClienteDto) {
    try {
      const cliente = this.clienteRepository.create(createClienteDto);
      await this.clienteRepository.save(cliente);
      return cliente;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  findAll() {
    return this.clienteRepository.find();
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: { autos: true }
    });
    if (!cliente) throw new NotFoundException(`Cliente with id ${id} not found`);
    return cliente;
  }

  async update(id: number, updateClienteDto: CreateClienteDto) {
    const cliente = await this.findOne(id); // checks if exists
    try {
      await this.clienteRepository.update(id, updateClienteDto);
      return { ...cliente, ...updateClienteDto };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    await this.clienteRepository.remove(cliente);
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Check server logs');
  }
}
