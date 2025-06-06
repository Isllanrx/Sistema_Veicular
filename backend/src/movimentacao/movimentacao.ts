import { DataSource } from 'typeorm';
import { Movimentacao } from './entities/movimentacao.entity';

export const movimentacaoProviders = [
  {
    provide: 'MOVIMENTACAO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Movimentacao),
    inject: ['DATA_SOURCE'],
  },
];

export { Movimentacao };