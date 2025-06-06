import { Inject, Injectable } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Repository, IsNull } from 'typeorm';
import { Produto } from './entities/produto.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @Inject('PRODUTO_REPOSITORY')
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  async create(createProdutoDto: CreateProdutoDto) {
    try {
      await this.produtoRepository.save(createProdutoDto);
      return {
        statusCode: 200,
        message: 'Produto cadastrado com sucesso',
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'Erro ao cadastrar Produto',
        error: error.message,
      };
    }
  }

  async findAll() {
    try {
      const produtos = await this.produtoRepository.find({
        where: { deleted_at: IsNull() },
        relations: ['categoria', 'fornecedor']
      });
      return produtos;
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'Erro ao buscar produtos',
        error: error.message,
      };
    }
  }

  async findOne(id: number) {
    try {
      const produto = await this.produtoRepository.findOne({ 
        where: { id, deleted_at: IsNull() },
        relations: ['categoria', 'fornecedor']
      });
      if (!produto) {
        return { statusCode: 404, message: 'Produto não encontrado' };
      }
      return produto;
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'Erro ao buscar produto',
        error: error.message,
      };
    }
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto) {
    try {
      const result = await this.produtoRepository.update(
        { id, deleted_at: IsNull() },
        updateProdutoDto
      );
      if (result.affected === 0) {
        return { statusCode: 404, message: 'Produto não encontrado para atualização' };
      }
      return { statusCode: 200, message: 'Produto atualizado com sucesso' };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'Erro ao atualizar produto',
        error: error.message,
      };
    }
  }

  async updateQuantidade(id: number, quantidade: number) {
    try {
      const result = await this.produtoRepository.update(
        { id, deleted_at: IsNull() },
        { quantidade: quantidade }
      );
      if (result.affected === 0) {
        return { statusCode: 404, message: 'Produto não encontrado para atualização' };
      }
      return { statusCode: 200, message: 'Quantidade do produto atualizada com sucesso' };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'Erro ao atualizar quantidade do produto',
        error: error.message,
      };
    }
  }

  async remove(id: number) {
    try {
      const result = await this.produtoRepository.update(
        { id, deleted_at: IsNull() },
        { deleted_at: new Date() }
      );
      if (result.affected === 0) {
        return { statusCode: 404, message: 'Produto não encontrado para remoção' };
      }
      return { statusCode: 200, message: 'Produto removido com sucesso' };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'Erro ao remover produto',
        error: error.message,
      };
    }
  }
}
