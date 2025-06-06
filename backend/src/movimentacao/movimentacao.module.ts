import { Module } from '@nestjs/common';
import { MovimentacaoService } from './movimentacao.service';
import { MovimentacaoController } from './movimentacao.controller';
import { movimentacaoProviders } from './movimentacao';
import { DatabaseModule } from 'src/database/database.module';
import { ProdutoModule } from 'src/produto/produto.module';

@Module({
  controllers: [MovimentacaoController],
  providers: [MovimentacaoService,...movimentacaoProviders],
    imports: [DatabaseModule, ProdutoModule]
})
export class MovimentacaoModule {}
