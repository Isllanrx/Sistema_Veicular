import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from './logger.service';

@Injectable()
export class AuditService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService
    ) {}

    async log(userId: string, action: string, entity: string, entityId: string, details: any) {
        try {
            return await this.prisma.auditLog.create({
                data: {
                    userId,
                    action,
                    entity,
                    entityId,
                    details,
                },
            });
        } catch (error) {
            this.logger.error(`Erro ao registrar log de auditoria: ${error.message}`);
            throw error;
        }
    }

    async logAction(data: {
        userId: string;
        action: string;
        entity: string;
        entityId: string;
        details: any;
        ipAddress?: string;
    }) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId: data.userId,
                    action: data.action,
                    entity: data.entity,
                    entityId: data.entityId,
                    details: data.details,
                    ipAddress: data.ipAddress,
                    timestamp: new Date(),
                },
            });

            this.logger.log(
                `Ação auditada: ${data.action} em ${data.entity} ${data.entityId}`,
                'AuditService'
            );
        } catch (error) {
            this.logger.error(
                `Erro ao registrar auditoria: ${error.message}`,
                error.stack,
                'AuditService'
            );
            throw error;
        }
    }

    async getAuditLogs(filters: {
        userId?: string;
        entity?: string;
        entityId?: string;
        startDate?: Date;
        endDate?: Date;
        action?: string;
    }) {
        const where = {
            ...(filters.userId && { userId: filters.userId }),
            ...(filters.entity && { entity: filters.entity }),
            ...(filters.entityId && { entityId: filters.entityId }),
            ...(filters.action && { action: filters.action }),
            ...(filters.startDate && filters.endDate && {
                timestamp: {
                    gte: filters.startDate,
                    lte: filters.endDate,
                },
            }),
        };

        return this.prisma.auditLog.findMany({
            where,
            orderBy: { timestamp: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async getEntityHistory(entity: string, entityId: string) {
        return this.prisma.auditLog.findMany({
            where: {
                entity,
                entityId,
            },
            orderBy: { timestamp: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
} 