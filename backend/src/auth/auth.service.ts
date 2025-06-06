import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RateLimit } from 'nestjs-rate-limiter';
import { UsuarioService } from 'src/usuario/usuario.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private readonly MAX_LOGIN_ATTEMPTS = 5;
    private readonly LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService,
    ) {}

    @RateLimit({
        points: 5,
        duration: 60,
        errorMessage: 'Muitas tentativas de login. Tente novamente em 1 minuto.'
    })
    async login(loginDto: LoginDto) {
        try {
            const usuario = await this.usuarioService.findByEmail(loginDto.email);
            
            if (!usuario) {
                this.logger.warn(`Tentativa de login falha para email: ${loginDto.email}`);
                throw new UnauthorizedException('Credenciais inválidas');
            }

            const validaSenha = await bcrypt.compare(loginDto.senha, usuario.senha);
            if (!validaSenha) {
                this.logger.warn(`Senha incorreta para usuário: ${usuario.email}`);
                throw new UnauthorizedException('Credenciais inválidas');
            }

            // Verificar se a conta está bloqueada
            if (usuario.loginAttempts >= this.MAX_LOGIN_ATTEMPTS && 
                Date.now() - usuario.lastLoginAttempt < this.LOCKOUT_TIME) {
                throw new UnauthorizedException('Conta temporariamente bloqueada. Tente novamente mais tarde.');
            }

            // Resetar tentativas de login após sucesso
            await this.usuarioService.resetLoginAttempts(usuario.id);

            const payload = {
                id: usuario.id,
                email: usuario.email,
                tipo: usuario.tipo,
                roles: usuario.roles
            };

            this.logger.log(`Login bem-sucedido para usuário: ${usuario.email}`);

            return {
                statusCode: 200,
                token: this.jwtService.sign(payload),
                user: {
                    id: usuario.id,
                    email: usuario.email,
                    tipo: usuario.tipo,
                    nome: usuario.nome
                }
            };
        } catch (error) {
            this.logger.error(`Erro durante login: ${error.message}`);
            throw error;
        }
    }

    async validateToken(token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token);
            return payload;
        } catch (error) {
            this.logger.error(`Token inválido: ${error.message}`);
            throw new UnauthorizedException('Token inválido');
        }
    }
}
