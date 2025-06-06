import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { Web3Module } from '../web3/web3.module';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';

@Module({
  imports: [
    PrismaModule,
    Web3Module,
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {} 