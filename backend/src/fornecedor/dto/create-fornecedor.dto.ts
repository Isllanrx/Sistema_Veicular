import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFornecedorDto {
  @ApiProperty({ description: 'Nome do fornecedor' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Empresa do fornecedor' })
  @IsString()
  empresa: string;

  @ApiProperty({ description: 'Email do fornecedor' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Telefone do fornecedor' })
  @IsString()
  telefone: string;

  @ApiProperty({ description: 'Endereço do fornecedor' })
  @IsOptional()
  @IsString()
  endereco: string;
}