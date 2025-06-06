import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Usuario as UsuarioInterface } from './interfaces/usuario.interface';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('USUARIO_REPOSITORY')
    private usuarioRepository: Repository<Usuario>,
    private prisma: PrismaService
  ) {}

  
  async create(createUsuarioDto: CreateUsuarioDto) {

    createUsuarioDto.senha = await bcrypt.hash(createUsuarioDto.senha, 10);

    try{
        await this.usuarioRepository.save(createUsuarioDto);
        return {
          code: 200,
          message: 'Usuario cadastrado com sucesso',
        }

    }catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        message: 'Erro ao cadastrar usuario',
        error: error.message,
      }
    }
    ;
  }

  findAll() {
    return this.usuarioRepository.find(
      {
        select: {
          id: true,
          nome: true,
          email: true,
          tipo: true
        }
      }
    );
  }

  async findByEmail(email: string): Promise<UsuarioInterface | null> {
    const usuario = await this.prisma.user.findUnique({
      where: { email },
    });
    return usuario as UsuarioInterface;
  }

  async findOne(id:number) {
    return await this.usuarioRepository.findOne({
      where: { id: id },
      select:{
        id: true,
        nome: true,
        email: true,
        tipo: true
      }
    });
  }

  async update(id: number, _updateUsuarioDto: UpdateUsuarioDto) {
    const result = await this.usuarioRepository.update(id, _updateUsuarioDto)
    if (result.affected === 0) {
      return {
        statusCode: 404,
        message: 'Usuario não encontrado',
      }
    }
    return {
      statusCode: 200,
      message: 'Usuario atualizado com sucesso',
    }
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }

  async resetLoginAttempts(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        loginAttempts: 0,
        lastLoginAttempt: new Date(),
      },
    });
  }
}
