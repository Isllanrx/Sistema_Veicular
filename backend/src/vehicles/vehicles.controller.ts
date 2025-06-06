import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Vehicle, VehicleStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { IVehicleStats, VehicleWithRelations } from './interfaces/vehicle.interface';
import { VehiclesService } from './vehicles.service';

/**
 * Controlador responsável por gerenciar as requisições HTTP relacionadas a veículos
 * @class VehiclesController
 * @description Implementa os endpoints REST para operações CRUD e consultas de veículos
 */
@ApiTags('vehicles')
@ApiBearerAuth()
@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  /**
   * Cria um novo veículo
   * @param {CreateVehicleDto} createVehicleDto - Dados do veículo a ser criado
   * @returns {Promise<Vehicle>} Veículo criado
   * @throws {BadRequestException} Se os dados forem inválidos
   * @example
   * POST /vehicles
   * {
   *   "brand": "Toyota",
   *   "model": "Corolla",
   *   "year": 2023,
   *   "licensePlate": "ABC1234",
   *   "chassis": "123456789",
   *   "mileage": 0,
   *   "color": "Prata",
   *   "fuelType": "FLEX",
   *   "purchasePrice": 120000,
   *   "purchaseDate": "2024-03-20T00:00:00.000Z"
   * }
   */
  @Post()
  @ApiOperation({ summary: 'Criar um novo veículo' })
  @ApiResponse({ status: 201, description: 'Veículo criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body(ValidationPipe) createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehiclesService.create(createVehicleDto);
  }

  /**
   * Lista todos os veículos com paginação e filtros
   * @param {number} skip - Número de registros para pular
   * @param {number} take - Número de registros para retornar
   * @param {VehicleStatus} status - Status do veículo para filtrar
   * @param {string} search - Termo de busca
   * @returns {Promise<Vehicle[]>} Lista de veículos
   * @example
   * GET /vehicles?skip=0&take=10&status=AVAILABLE&search=Toyota
   */
  @Get()
  @ApiOperation({ summary: 'Listar todos os veículos' })
  @ApiResponse({ status: 200, description: 'Lista de veículos retornada com sucesso' })
  findAll(
    @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
    @Query('status') status?: VehicleStatus,
    @Query('search') search?: string,
  ): Promise<Vehicle[]> {
    return this.vehiclesService.findAll({ skip, take, status, search });
  }

  /**
   * Obtém estatísticas dos veículos
   * @returns {Promise<IVehicleStats>} Estatísticas dos veículos
   * @example
   * GET /vehicles/stats
   * // Response:
   * // {
   * //   "total": 100,
   * //   "available": 50,
   * //   "maintenance": 10,
   * //   "sold": 30,
   * //   "rented": 10
   * // }
   */
  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas dos veículos' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso' })
  getStats(): Promise<IVehicleStats> {
    return this.vehiclesService.getVehicleStats();
  }

  /**
   * Busca um veículo específico pelo ID
   * @param {string} id - ID do veículo
   * @returns {Promise<VehicleWithRelations>} Veículo encontrado com suas relações
   * @throws {NotFoundException} Se o veículo não for encontrado
   * @example
   * GET /vehicles/123e4567-e89b-12d3-a456-426614174000
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obter um veículo específico' })
  @ApiResponse({ status: 200, description: 'Veículo encontrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  findOne(@Param('id') id: string): Promise<VehicleWithRelations> {
    return this.vehiclesService.findOne(id);
  }

  /**
   * Atualiza um veículo existente
   * @param {string} id - ID do veículo
   * @param {UpdateVehicleDto} updateVehicleDto - Dados a serem atualizados
   * @returns {Promise<Vehicle>} Veículo atualizado
   * @throws {NotFoundException} Se o veículo não for encontrado
   * @example
   * PATCH /vehicles/123e4567-e89b-12d3-a456-426614174000
   * {
   *   "status": "SOLD",
   *   "salePrice": 130000,
   *   "saleDate": "2024-03-20T00:00:00.000Z"
   * }
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um veículo' })
  @ApiResponse({ status: 200, description: 'Veículo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  /**
   * Remove um veículo do sistema
   * @param {string} id - ID do veículo
   * @returns {Promise<Vehicle>} Veículo removido
   * @throws {NotFoundException} Se o veículo não for encontrado
   * @example
   * DELETE /vehicles/123e4567-e89b-12d3-a456-426614174000
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um veículo' })
  @ApiResponse({ status: 200, description: 'Veículo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  remove(@Param('id') id: string): Promise<Vehicle> {
    return this.vehiclesService.remove(id);
  }
} 