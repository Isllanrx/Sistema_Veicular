import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: TypeOrmHealthIndicator,
        private disk: DiskHealthIndicator,
        private memory: MemoryHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    @ApiOperation({ summary: 'Verificar saúde do sistema' })
    check() {
        return this.health.check([
            // Verificar conexão com banco de dados
            () => this.db.pingCheck('database'),
            
            // Verificar espaço em disco
            () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
            
            // Verificar uso de memória
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
        ]);
    }
} 