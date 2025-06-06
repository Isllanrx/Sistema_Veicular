import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';

@Injectable()
export class CategoriaService {
  repository: any;
  constructor(
    @Inject('CATEGORIA_REPOSITORY')
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  private handleError(error: unknown, message: string) {
    console.error(error);
    return {
      statusCode: 500,
      message,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      await this.categoriaRepository.save(createCategoriaDto);
      return {
        statusCode: 200,
        message: 'Categoria cadastrada com sucesso',
      };
    } catch (error: unknown) {
      return this.handleError(error, 'Erro ao cadastrar categoria');
    }
  }

  async findAll() {
    try {
      return await this.categoriaRepository.find();
    } catch (error: unknown) {
      return this.handleError(error, 'Erro ao buscar categorias');
    }
  }

  async findOne(id: number) {
    try {
      const categoria = await this.categoriaRepository.findOneBy({ id });
      if (!categoria) {
        return { statusCode: 404, message: 'Categoria não encontrada' };
      }
      return categoria;
    } catch (error: unknown) {
      return this.handleError(error, 'Erro ao buscar categoria');
    }
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    try {
      const result = await this.categoriaRepository.update(id, updateCategoriaDto);
      if (result.affected === 0) {
        return { statusCode: 404, message: 'Categoria não encontrada para atualização' };
      }
      return { statusCode: 200, message: 'Categoria atualizada com sucesso' };
    } catch (error: unknown) {
      return this.handleError(error, 'Erro ao atualizar categoria');
    }
  }

  async remove(id: number) {
    try {
      const result = await this.categoriaRepository.delete(id);
      if (result.affected === 0) {
        return { statusCode: 404, message: 'Categoria não encontrada para remoção' };
      }
      return { statusCode: 200, message: 'Categoria removida com sucesso' };
    } catch (error: unknown) {
      return this.handleError(error, 'Erro ao remover categoria');
    }
  }
}
