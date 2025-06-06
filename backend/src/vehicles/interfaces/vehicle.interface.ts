import { FuelType, Vehicle, VehicleStatus } from '@prisma/client';

export interface IVehicleCreate {
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  chassis: string;
  mileage: number;
  color: string;
  fuelType: FuelType;
  purchasePrice: number;
  purchaseDate: Date;
}

export interface IVehicleUpdate {
  brand?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  chassis?: string;
  mileage?: number;
  color?: string;
  fuelType?: FuelType;
  status?: VehicleStatus;
  salePrice?: number;
  saleDate?: Date;
}

export interface IVehicleQuery {
  skip?: number;
  take?: number;
  status?: VehicleStatus;
  search?: string;
}

export interface IVehicleStats {
  total: number;
  available: number;
  maintenance: number;
  sold: number;
  rented: number;
}

export type VehicleWithRelations = Vehicle & {
  maintenance: any[];
  transactions: any[];
}; 