import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({ description: 'Nome da categoria' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Descrição da categoria' })
  @IsString()
  descricao: string; 
}
