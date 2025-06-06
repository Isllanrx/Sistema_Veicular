import { Inject, Injectable } from '@nestjs/common';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
import { Repository } from 'typeorm';
import { Movimentacao } from './entities/movimentacao.entity';
import { ProdutoService } from 'src/produto/produto.service';
import { Produto } from 'src/produto/produto';

@Injectable()
export class MovimentacaoService {
  constructor(
    @Inject('MOVIMENTACAO_REPOSITORY')
    private readonly MovimentacaoRepository: Repository<Movimentacao>,
    private readonly produtoService: ProdutoService
  ) {}

  async create(createMovimentacaoDto: CreateMovimentacaoDto, idUser: number) {
    try {
      const movimentacao = {
        ...createMovimentacaoDto,
        usuarioId: idUser,
        data_criacao: new Date()
      };
      
      await this.MovimentacaoRepository.save(movimentacao);
      const result = await this.produtoService.findOne(createMovimentacaoDto.produtoId);
      const produto = result as Produto
      const qtdFinal = createMovimentacaoDto.tipo === 'ENTRADA' ? produto.quantidade + createMovimentacaoDto.quantidade : produto.quantidade - createMovimentacaoDto.quantidade
      await this.produtoService.updateQuantidade(createMovimentacaoDto.produtoId, qtdFinal)

      return {
        statusCode: 200,
        message: 'Movimentacao efetuada com sucesso',
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'Erro ao efetuar Movimentacao',
        error: error.message,
      };
    }
  }

  async findAll() {
    try {
      const Movimentacao = await this.MovimentacaoRepository.find();
      return Movimentacao;
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'Erro ao buscar Movimentacaos',
        error: error.message,
      };
    }
  }

  async findOne(id: number) {
    try {
      const Movimentacao = await this.MovimentacaoRepository.findOne({ where: { id } });
      if (!Movimentacao) {
        return { statusCode: 404, message: 'Movimentacao não encontrado' };
      }
      return Movimentacao;
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'Erro ao buscar Movimentacao',
        error: error.message,
      };
    }
  }

  async remove(id: number) {
    try {
      const result = await this.MovimentacaoRepository.findOne({where: {id}});
      if (result === null) {
        return { statusCode: 404, message: 'Movimentacao não encontrado para remoção' };
      }
      console.log(result)
      const resultProduto = await this.produtoService.findOne(result.produtoId);
      const produto = resultProduto as Produto
      console.log(produto)
      const qtdFinal = (result.tipo === 'ENTRADA' ? produto.quantidade - result.quantidade : produto.quantidade + result.quantidade)
      await this.produtoService.updateQuantidade(result.produtoId, qtdFinal);

      await this.MovimentacaoRepository.update(id, { data_exclusao: new Date() });
      
      return { statusCode: 200, message: 'Movimentacao removido com sucesso' };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'Erro ao remover Movimentacao',
        error: error.message,
      };
    }
  }
}
