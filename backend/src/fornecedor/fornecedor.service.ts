import { Inject, Injectable } from '@nestjs/common';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { Repository } from 'typeorm';
import { Fornecedor } from './entities/fornecedor.entity';

@Injectable()
export class FornecedorService {
  constructor(
    @Inject('FORNECEDOR_REPOSITORY')
    private readonly FornecedorRepository: Repository<Fornecedor>,
  ) {}

  async create(CreateFornecedorDto: CreateFornecedorDto) {
    try {
      await this.FornecedorRepository.save(CreateFornecedorDto);
      return {
        code: 200,
        message: 'Fornecedor cadastrado com sucesso',
      };
    } catch (error) {
      console.error(error);
      return {
        code: 500,
        message: 'Erro ao cadastrar Fornecedor',
        error: error.message,
      };
    }
  }

  async findAll() {
    try {
      const Fornecedors = await this.FornecedorRepository.find();
      return Fornecedors;
    } catch (error) {
      console.error(error);
      return {
        code: 500,
        message: 'Erro ao buscar Fornecedors',
        error: error.message,
      };
    }
  }

  async findOne(id: number) {
    try {
      const Fornecedor = await this.FornecedorRepository.findOne({ where: { id } });
      if (!Fornecedor) {
        return { code: 404, message: 'Fornecedor não encontrado' };
      }
      return Fornecedor;
    } catch (error) {
      console.error(error);
      return {
        code: 500,
        message: 'Erro ao buscar Fornecedor',
        error: error.message,
      };
    }
  }

  async update(id: number, updateFornecedorDto: UpdateFornecedorDto) {
    try {
      const result = await this.FornecedorRepository.update(id, updateFornecedorDto);
      if (result.affected === 0) {
        return { code: 404, message: 'Fornecedor não encontrado para atualização' };
      }
      return { code: 200, message: 'Fornecedor atualizado com sucesso' };
    } catch (error) {
      console.error(error);
      return {
        code: 500,
        message: 'Erro ao atualizar Fornecedor',
        error: error.message,
      };
    }
  }

  async remove(id: number) {
    try {
      const result = await this.FornecedorRepository.delete(id);
      if (result.affected === 0) {
        return { code: 404, message: 'Fornecedor não encontrado para remoção' };
      }
      return { code: 200, message: 'Fornecedor removido com sucesso' };
    } catch (error) {
      console.error(error);
      return {
        code: 500,
        message: 'Erro ao remover Fornecedor',
        error: error.message,
      };
    }
  }
}
