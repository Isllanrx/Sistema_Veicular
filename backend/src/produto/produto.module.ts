import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { produtoProviders } from './produto';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ProdutoController],
  providers: [ProdutoService,...produtoProviders],
  imports: [DatabaseModule],
  exports: [ProdutoService],
})
export class ProdutoModule {}
