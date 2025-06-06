import { Injectable, NotFoundException } from '@nestjs/common';
import { Vehicle, VehicleStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
    IVehicleCreate,
    IVehicleQuery,
    IVehicleStats,
    IVehicleUpdate,
    VehicleWithRelations,
} from './interfaces/vehicle.interface';

/**
 * Serviço responsável por gerenciar todas as operações relacionadas a veículos
 * @class VehiclesService
 * @description Implementa a lógica de negócio para o módulo de veículos,
 * incluindo CRUD, consultas e estatísticas.
 */
@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria um novo veículo no sistema
   * @param {IVehicleCreate} data - Dados do veículo a ser criado
   * @returns {Promise<Vehicle>} Veículo criado
   * @throws {Error} Se houver erro na criação do veículo
   * @example
   * const newVehicle = await vehiclesService.create({
   *   brand: "Toyota",
   *   model: "Corolla",
   *   year: 2023,
   *   licensePlate: "ABC1234",
   *   chassis: "123456789",
   *   mileage: 0,
   *   color: "Prata",
   *   fuelType: "FLEX",
   *   purchasePrice: 120000,
   *   purchaseDate: new Date()
   * });
   */
  async create(data: IVehicleCreate): Promise<Vehicle> {
    return this.prisma.vehicle.create({
      data: {
        ...data,
        status: VehicleStatus.AVAILABLE,
      },
    });
  }

  /**
   * Lista todos os veículos com paginação e filtros
   * @param {IVehicleQuery} params - Parâmetros de paginação e filtros
   * @returns {Promise<Vehicle[]>} Lista de veículos
   * @example
   * const vehicles = await vehiclesService.findAll({
   *   skip: 0,
   *   take: 10,
   *   status: "AVAILABLE",
   *   search: "Toyota"
   * });
   */
  async findAll(params: IVehicleQuery): Promise<Vehicle[]> {
    const { skip, take, status, search } = params;
    return this.prisma.vehicle.findMany({
      skip,
      take,
      where: {
        status,
        OR: search
          ? [
              { brand: { contains: search, mode: 'insensitive' } },
              { model: { contains: search, mode: 'insensitive' } },
              { licensePlate: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca um veículo específico pelo ID
   * @param {string} id - ID do veículo
   * @returns {Promise<VehicleWithRelations>} Veículo encontrado com suas relações
   * @throws {NotFoundException} Se o veículo não for encontrado
   * @example
   * const vehicle = await vehiclesService.findOne("123e4567-e89b-12d3-a456-426614174000");
   */
  async findOne(id: string): Promise<VehicleWithRelations> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        maintenance: true,
        transactions: true,
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }

    return vehicle;
  }

  /**
   * Atualiza um veículo existente
   * @param {string} id - ID do veículo
   * @param {IVehicleUpdate} data - Dados a serem atualizados
   * @returns {Promise<Vehicle>} Veículo atualizado
   * @throws {NotFoundException} Se o veículo não for encontrado
   * @example
   * const updatedVehicle = await vehiclesService.update("123e4567-e89b-12d3-a456-426614174000", {
   *   status: "SOLD",
   *   salePrice: 130000,
   *   saleDate: new Date()
   * });
   */
  async update(id: string, data: IVehicleUpdate): Promise<Vehicle> {
    try {
      return await this.prisma.vehicle.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }
  }

  /**
   * Remove um veículo do sistema
   * @param {string} id - ID do veículo
   * @returns {Promise<Vehicle>} Veículo removido
   * @throws {NotFoundException} Se o veículo não for encontrado
   * @example
   * const deletedVehicle = await vehiclesService.remove("123e4567-e89b-12d3-a456-426614174000");
   */
  async remove(id: string): Promise<Vehicle> {
    try {
      return await this.prisma.vehicle.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }
  }

  /**
   * Obtém estatísticas dos veículos
   * @returns {Promise<IVehicleStats>} Estatísticas dos veículos
   * @example
   * const stats = await vehiclesService.getVehicleStats();
   * console.log(stats);
   * // {
   * //   total: 100,
   * //   available: 50,
   * //   maintenance: 10,
   * //   sold: 30,
   * //   rented: 10
   * // }
   */
  async getVehicleStats(): Promise<IVehicleStats> {
    const [
      totalVehicles,
      availableVehicles,
      maintenanceVehicles,
      soldVehicles,
      rentedVehicles,
    ] = await Promise.all([
      this.prisma.vehicle.count(),
      this.prisma.vehicle.count({
        where: { status: VehicleStatus.AVAILABLE },
      }),
      this.prisma.vehicle.count({
        where: { status: VehicleStatus.MAINTENANCE },
      }),
      this.prisma.vehicle.count({
        where: { status: VehicleStatus.SOLD },
      }),
      this.prisma.vehicle.count({
        where: { status: VehicleStatus.RENTED },
      }),
    ]);

    return {
      total: totalVehicles,
      available: availableVehicles,
      maintenance: maintenanceVehicles,
      sold: soldVehicles,
      rented: rentedVehicles,
    };
  }
} 