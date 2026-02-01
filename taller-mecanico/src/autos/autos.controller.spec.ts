import { Test, TestingModule } from '@nestjs/testing';
import { AutosController } from './autos.controller';
import { AutosService } from './autos.service';

describe('AutosController', () => {
  let controller: AutosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutosController],
      providers: [AutosService],
    }).compile();

    controller = module.get<AutosController>(AutosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
