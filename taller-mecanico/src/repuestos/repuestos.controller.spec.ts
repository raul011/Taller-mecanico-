import { Test, TestingModule } from '@nestjs/testing';
import { RepuestosController } from './repuestos.controller';
import { RepuestosService } from './repuestos.service';

describe('RepuestosController', () => {
  let controller: RepuestosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepuestosController],
      providers: [RepuestosService],
    }).compile();

    controller = module.get<RepuestosController>(RepuestosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
