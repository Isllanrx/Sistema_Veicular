import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { MovimentacaoService } from './movimentacao.service';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';

@Controller('movimentacao')
export class MovimentacaoController {
  constructor(private readonly movimentacaoService: MovimentacaoService) {}

  @Post()
  create(@Body() createMovimentacaoDto: CreateMovimentacaoDto, @Request() req) {

    const user = req.user;

    return this.movimentacaoService.create(createMovimentacaoDto, user.id);
  }

  @Get()
  findAll() {
    return this.movimentacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimentacaoService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimentacaoService.remove(+id);
  }
}
