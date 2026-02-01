import { Test, TestingModule } from '@nestjs/testing';
import { ServiciosTrabajoController } from './servicios-trabajo.controller';
import { ServiciosTrabajoService } from './servicios-trabajo.service';

describe('ServiciosTrabajoController', () => {
  let controller: ServiciosTrabajoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiciosTrabajoController],
      providers: [ServiciosTrabajoService],
    }).compile();

    controller = module.get<ServiciosTrabajoController>(ServiciosTrabajoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
