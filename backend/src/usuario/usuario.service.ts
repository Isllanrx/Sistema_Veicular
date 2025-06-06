import { Inject, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('USUARIO_REPOSITORY')
    private usuarioRepository: Repository<Usuario>,
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

  async findByEmail(paramEmail: string) {
    return await this.usuarioRepository.findOne({where:{email: paramEmail}});
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
}
