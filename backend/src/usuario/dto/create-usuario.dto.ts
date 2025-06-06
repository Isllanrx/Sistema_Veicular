import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'usuario@exemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  senha: string;
}
