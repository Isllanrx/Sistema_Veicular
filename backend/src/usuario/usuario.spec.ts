import { Test, TestingModule } from '@nestjs/testing';
import { Usuario } from './usuario';

describe('Usuario', () => {
  let provider: Usuario;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Usuario],
    }).compile();

    provider = module.get<Usuario>(Usuario);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
