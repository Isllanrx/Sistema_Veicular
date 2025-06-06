import { IsString, IsInt, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovimentacaoDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsInt()
  produtoId: number;

  @ApiProperty({ description: 'Tipo da movimentação' })
  @IsEnum(['ENTRADA', 'SAIDA'])
  tipo: ('ENTRADA' | 'SAIDA');

  @ApiProperty({ description: 'Quantidade movimentada' })
  @IsInt()
  quantidade: number;

  @ApiProperty({ description: 'Observação da movimentação' })
  @IsString()
  @IsOptional()
  observacao: string;
}