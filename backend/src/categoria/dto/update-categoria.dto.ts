import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCategoriaDto } from './create-categoria.dto';

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {
  @ApiProperty({ description: 'ID da categoria', required: false })
  id?: number;

  @ApiProperty({ description: 'Nome da categoria', required: false })
  nome?: string;

  @ApiProperty({ description: 'Descrição da categoria', required: false })
  descricao?: string;

  @ApiProperty({ description: 'Ativa', required: false })
  ativa?: boolean;
}
