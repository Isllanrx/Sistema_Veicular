import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { Web3Service } from '../web3/web3.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly web3Service: Web3Service,
  ) {}

  async create(createContractDto: CreateContractDto, file: Express.Multer.File) {
    const fileHash = this.calculateFileHash(file.buffer);
    
    const contract = await this.prisma.contract.create({
      data: {
        ...createContractDto,
        fileName: file.originalname,
        mimeType: file.mimetype,
        fileHash,
        fileSize: file.size,
        fileBuffer: file.buffer,
        uploadDate: new Date(),
      },
    });

    // Registrar o hash do arquivo na blockchain
    await this.web3Service.registerDocumentHash(
      fileHash,
      contract.id,
    );

    return contract;
  }

  async findAll() {
    return this.prisma.contract.findMany();
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
    });
    
    if (!contract) {
      throw new NotFoundException(`Contrato com ID ${id} não encontrado`);
    }
    
    return contract;
  }

  async getContractFile(id: string) {
    const contract = await this.findOne(id);
    return {
      buffer: contract.fileBuffer,
      fileName: contract.fileName,
      mimeType: contract.mimeType,
    };
  }

  async verifyContractIntegrity(id: string) {
    const contract = await this.findOne(id);
    const blockchainHash = await this.web3Service.getDocumentHash(
      contract.id,
    );

    return {
      isValid: blockchainHash === contract.fileHash,
      contractHash: contract.fileHash,
      blockchainHash,
    };
  }

  async update(id: string, updateContractDto: UpdateContractDto) {
    const contract = await this.prisma.contract.update({
      where: { id },
      data: updateContractDto,
    });
    
    if (!contract) {
      throw new NotFoundException(`Contrato com ID ${id} não encontrado`);
    }
    
    return contract;
  }

  async remove(id: string) {
    const contract = await this.prisma.contract.delete({
      where: { id },
    });
    
    if (!contract) {
      throw new NotFoundException(`Contrato com ID ${id} não encontrado`);
    }
    
    return contract;
  }

  private calculateFileHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }
} 