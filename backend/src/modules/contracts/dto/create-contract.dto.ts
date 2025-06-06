import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContractDto {
  @ApiProperty({
    description: 'ID da transação associada ao contrato',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;
} 