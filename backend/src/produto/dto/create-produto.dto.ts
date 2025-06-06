import { IsString, IsInt, isNumber, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProdutoDto {
  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Descrição do produto' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ description: 'Preço do produto' })
  @IsNumber()
  preco: number;

  @ApiProperty({ description: 'Quantidade do produto em estoque' })
  @IsInt()
  quantidade: number;
 
  @ApiProperty({ description: 'ID do fornecedor' })
  @IsInt() 
  fornecedorId: number;

  @ApiProperty({ description: 'ID da categoria' })
  @IsInt()
  categoriaId: number;
}