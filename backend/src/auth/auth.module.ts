import { Module } from '@nestjs/common';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constant';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [UsuarioModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET?? jwtConstants.secret,
            signOptions: { expiresIn: '2h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ]
})
export class AuthModule { }
