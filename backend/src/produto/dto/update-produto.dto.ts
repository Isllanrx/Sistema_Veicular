import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProdutoDto } from './create-produto.dto';

export class UpdateProdutoDto{
  @ApiProperty({ description: 'Nome do produto', required: false })
  nome?: string;

  @ApiProperty({ description: 'Descrição do produto', required: false })
  descricao?: string;

  @ApiProperty({ description: 'Preço do produto', required: false })
  preco?: number;
}
