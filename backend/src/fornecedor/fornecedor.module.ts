import { Module } from '@nestjs/common';
import { FornecedorService } from './fornecedor.service';
import { FornecedorController } from './fornecedor.controller';
import { fornecedorProviders } from './fornecedor';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [FornecedorController],
  providers: [FornecedorService,...fornecedorProviders],
  imports: [DatabaseModule]
})
export class FornecedorModule {}
