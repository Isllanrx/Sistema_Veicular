import { Test, TestingModule } from '@nestjs/testing';
import { FuelType, VehicleStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehiclesService } from './vehicles.service';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiclesService, PrismaService],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vehicle', async () => {
      const createVehicleDto: CreateVehicleDto = {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2023,
        licensePlate: 'ABC1234',
        chassis: '123456789',
        mileage: 0,
        color: 'Preto',
        fuelType: FuelType.FLEX,
        status: VehicleStatus.AVAILABLE,
        purchasePrice: 100000,
        purchaseDate: new Date(),
      };

      const mockVehicle = {
        id: '1',
        ...createVehicleDto,
        salePrice: null,
        saleDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.vehicle, 'create').mockResolvedValue(mockVehicle);

      const result = await service.create(createVehicleDto);

      expect(result).toEqual(mockVehicle);
      expect(prisma.vehicle.create).toHaveBeenCalledWith({
        data: createVehicleDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of vehicles', async () => {
      const mockVehicles = [
        {
          id: '1',
          brand: 'Toyota',
          model: 'Corolla',
          year: 2023,
          licensePlate: 'ABC1234',
          chassis: '123456789',
          mileage: 0,
          color: 'Preto',
          fuelType: FuelType.FLEX,
          status: VehicleStatus.AVAILABLE,
          purchasePrice: 100000,
          salePrice: null,
          purchaseDate: new Date(),
          saleDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prisma.vehicle, 'findMany').mockResolvedValue(mockVehicles);

      const result = await service.findAll();

      expect(result).toEqual(mockVehicles);
      expect(prisma.vehicle.findMany).toHaveBeenCalled();
    });
  });
}); 