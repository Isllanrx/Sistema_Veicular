import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { categoriaProviders } from './categoria';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService, ...categoriaProviders],
  imports: [DatabaseModule],
})
export class CategoriaModule {}
