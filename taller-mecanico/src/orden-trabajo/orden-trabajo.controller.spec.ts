import { Test, TestingModule } from '@nestjs/testing';
import { OrdenTrabajoController } from './orden-trabajo.controller';
import { OrdenTrabajoService } from './orden-trabajo.service';

describe('OrdenTrabajoController', () => {
  let controller: OrdenTrabajoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdenTrabajoController],
      providers: [OrdenTrabajoService],
    }).compile();

    controller = module.get<OrdenTrabajoController>(OrdenTrabajoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
