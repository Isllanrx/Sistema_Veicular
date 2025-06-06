import { Global, Module } from '@nestjs/common';
import { AuditService } from './services/audit.service';
import { LoggerService } from './services/logger.service';
import { NotificationService } from './services/notification.service';

@Global()
@Module({
  providers: [LoggerService, AuditService, NotificationService],
  exports: [LoggerService, AuditService, NotificationService],
})
export class SharedModule {} 