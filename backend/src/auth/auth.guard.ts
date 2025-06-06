import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './public.decorator';
import { jwtConstants } from './auth.constant';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwtService:JwtService, private reflector: Reflector) {}  
  async canActivate(context: ExecutionContext){

    //Verifica se a rota é pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler()
    ]);
  
    if (isPublic) {
      return true;
    }

    //Pego as informações do request
    const request = context.switchToHttp().getRequest();

    //Verifico se existe o token no header
    const token = request.headers['authorization'];
    if (!token) {
      throw new UnauthorizedException();
    }

    try{
      const split = token.split(' ');
      const payload = split[1];
      
      if (!payload) {
        throw new UnauthorizedException();
      }

      const verify = await this.jwtService.verifyAsync(payload, {
        secret:jwtConstants.secret,
      });
      request['user'] = verify

    }catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
