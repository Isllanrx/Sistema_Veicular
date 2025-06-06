import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@ApiTags('contracts')
@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        transactionId: {
          type: 'string',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Criar novo contrato' })
  create(
    @Body() createContractDto: CreateContractDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.contractsService.create(createContractDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os contratos' })
  findAll() {
    return this.contractsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar contrato por ID' })
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  @Get(':id/file')
  @ApiOperation({ summary: 'Download do arquivo do contrato' })
  async getContractFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.contractsService.getContractFile(id);
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.fileName}"`,
    );
    res.send(file.buffer);
  }

  @Get(':id/verify')
  @ApiOperation({ summary: 'Verificar integridade do contrato' })
  verifyContractIntegrity(@Param('id') id: string) {
    return this.contractsService.verifyContractIntegrity(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar contrato' })
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractsService.update(id, updateContractDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover contrato' })
  remove(@Param('id') id: string) {
    return this.contractsService.remove(id);
  }
} 