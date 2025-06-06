import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateFornecedorDto } from './create-fornecedor.dto';

export class UpdateFornecedorDto extends PartialType(CreateFornecedorDto) {
  @ApiProperty({ description: 'Nome do fornecedor', required: false })
  nome?: string;

  @ApiProperty({ description: 'Contato do fornecedor', required: false })
  contato?: string;

  @ApiProperty({ description: 'Telefone do fornecedor', required: false })
  telefone?: string;

  @ApiProperty({ description: 'Endereço do fornecedor', required: false })
  endereco?: string;
}
