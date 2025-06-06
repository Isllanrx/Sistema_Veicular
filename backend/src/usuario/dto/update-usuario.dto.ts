import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @ApiProperty({ description: 'Nome do usuário', required: false })
  nome?: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'usuario@exemplo.com', required: false })
  email?: string;

  @ApiProperty({ description: 'Senha do usuário', required: false })
  senha?: string;

  
}
