import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvisoCreadosService } from './aviso_creados.service';
import { CreateAvisoCreadoDto } from './dto/create-aviso_creado.dto';
import { UpdateAvisoCreadoDto } from './dto/update-aviso_creado.dto';

@Controller('aviso-creados')
export class AvisoCreadosController {
  constructor(private readonly avisoCreadosService: AvisoCreadosService) {}

  @Post()
  create(@Body() createAvisoCreadoDto: CreateAvisoCreadoDto) {
    return this.avisoCreadosService.create(createAvisoCreadoDto);
  }

  @Get()
  findAll() {
    return this.avisoCreadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avisoCreadosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvisoCreadoDto: UpdateAvisoCreadoDto) {
    return this.avisoCreadosService.update(+id, updateAvisoCreadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avisoCreadosService.remove(+id);
  }
}
