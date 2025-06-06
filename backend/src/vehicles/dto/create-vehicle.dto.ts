import { ApiProperty } from '@nestjs/swagger';
import { FuelType } from '@prisma/client';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ description: 'Marca do veículo' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ description: 'Modelo do veículo' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ description: 'Ano do veículo' })
  @IsNumber()
  @Min(1900)
  year: number;

  @ApiProperty({ description: 'Placa do veículo' })
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ description: 'Número do chassi' })
  @IsString()
  @IsNotEmpty()
  chassis: string;

  @ApiProperty({ description: 'Quilometragem atual' })
  @IsNumber()
  @Min(0)
  mileage: number;

  @ApiProperty({ description: 'Cor do veículo' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ description: 'Tipo de combustível', enum: FuelType })
  @IsEnum(FuelType)
  fuelType: FuelType;

  @ApiProperty({ description: 'Preço de compra' })
  @IsNumber()
  @Min(0)
  purchasePrice: number;

  @ApiProperty({ description: 'Data de compra' })
  @IsDate()
  purchaseDate: Date;
} 