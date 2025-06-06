import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriaModule } from './categoria/categoria.module';
import { FornecedorModule } from './fornecedor/fornecedor.module';
import { MovimentacaoModule } from './movimentacao/movimentacao.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProdutoModule } from './produto/produto.module';
import { SharedModule } from './shared/shared.module';
import { UsuarioModule } from './usuario/usuario.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SharedModule,
    AuthModule,
    UsuarioModule,
    VehiclesModule,
    CategoriaModule,
    ProdutoModule,
    FornecedorModule,
    MovimentacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
