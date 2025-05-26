import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoAvisosService } from './tipo_avisos.service';
import { CreateTipoAvisoDto } from './dto/create-tipo_aviso.dto';
import { UpdateTipoAvisoDto } from './dto/update-tipo_aviso.dto';

@Controller('tipo-avisos')
export class TipoAvisosController {
  constructor(private readonly tipoAvisosService: TipoAvisosService) {}

  @Post()
  create(@Body() createTipoAvisoDto: CreateTipoAvisoDto) {
    return this.tipoAvisosService.create(createTipoAvisoDto);
  }

  @Get()
  findAll() {
    return this.tipoAvisosService.findAll();
  }

 
}
