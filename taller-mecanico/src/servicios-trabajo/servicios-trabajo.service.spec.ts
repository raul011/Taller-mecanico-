import { Test, TestingModule } from '@nestjs/testing';
import { ServiciosTrabajoService } from './servicios-trabajo.service';

describe('ServiciosTrabajoService', () => {
  let service: ServiciosTrabajoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiciosTrabajoService],
    }).compile();

    service = module.get<ServiciosTrabajoService>(ServiciosTrabajoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
