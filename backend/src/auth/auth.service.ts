import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    private readonly MAX_LOGIN_ATTEMPTS = 5;
    private readonly LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const usuario = await this.usuarioService.findByEmail(loginDto.email);
        
        if (!usuario) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        if (!usuario.isActive) {
            throw new UnauthorizedException('Usuário inativo');
        }

        const validaSenha = await bcrypt.compare(loginDto.senha, usuario.password);
        
        if (!validaSenha) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        if (usuario.loginAttempts >= this.MAX_LOGIN_ATTEMPTS &&
            usuario.lastLoginAttempt &&
            Date.now() - usuario.lastLoginAttempt.getTime() < this.LOCKOUT_TIME) {
            throw new UnauthorizedException('Conta bloqueada temporariamente');
        }

        await this.usuarioService.resetLoginAttempts(usuario.id);

        const payload = { 
            email: usuario.email, 
            sub: usuario.id,
            roles: usuario.roles || [usuario.role]
        };
        
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: usuario.id,
                email: usuario.email,
                name: usuario.name || usuario.nome,
                roles: usuario.roles || [usuario.role]
            }
        };
    }

    async validateUser(email: string, password: string): Promise<any> {
        const usuario = await this.usuarioService.findByEmail(email);
        
        if (!usuario) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        if (!usuario.isActive) {
            throw new UnauthorizedException('Usuário inativo');
        }

        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const { password: _, ...result } = usuario;
        return result;
    }
}
