import { ApiProperty } from '@nestjs/swagger';
import { FuelType, VehicleStatus } from '@prisma/client';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateVehicleDto {
  @ApiProperty({ description: 'Marca do veículo', required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ description: 'Modelo do veículo', required: false })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({ description: 'Ano do veículo', required: false })
  @IsNumber()
  @Min(1900)
  @IsOptional()
  year?: number;

  @ApiProperty({ description: 'Placa do veículo', required: false })
  @IsString()
  @IsOptional()
  licensePlate?: string;

  @ApiProperty({ description: 'Número do chassi', required: false })
  @IsString()
  @IsOptional()
  chassis?: string;

  @ApiProperty({ description: 'Quilometragem atual', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  mileage?: number;

  @ApiProperty({ description: 'Cor do veículo', required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ description: 'Tipo de combustível', enum: FuelType, required: false })
  @IsEnum(FuelType)
  @IsOptional()
  fuelType?: FuelType;

  @ApiProperty({ description: 'Status do veículo', enum: VehicleStatus, required: false })
  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus;

  @ApiProperty({ description: 'Preço de venda', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salePrice?: number;

  @ApiProperty({ description: 'Data de venda', required: false })
  @IsDate()
  @IsOptional()
  saleDate?: Date;
} 