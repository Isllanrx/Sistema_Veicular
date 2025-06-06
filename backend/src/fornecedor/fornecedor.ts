import { DataSource } from 'typeorm';
import { Fornecedor } from './entities/fornecedor.entity';

export const fornecedorProviders = [
  {
    provide: 'FORNECEDOR_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Fornecedor),
    inject: ['DATA_SOURCE'],
  },
];

export { Fornecedor};