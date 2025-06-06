import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMovimentacaoDto } from './create-movimentacao.dto';

export class UpdateMovimentacaoDto extends PartialType(CreateMovimentacaoDto) {
  @ApiProperty({ description: 'ID da movimentação', required: false })
  id?: number;

  @ApiProperty({ description: 'Tipo da movimentação', required: false })
  tipo?: ('ENTRADA' | 'SAIDA');

  @ApiProperty({ description: 'Quantidade movimentada', required: false })
  quantidade?: number;

  @ApiProperty({ description: 'Observação da movimentação', required: false })
  observacao?: string;
}
