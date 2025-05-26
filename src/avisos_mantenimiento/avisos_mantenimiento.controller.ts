import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvisosMantenimientoService } from './avisos_mantenimiento.service';
import { CreateAvisosMantenimientoDto } from './dto/create-avisos_mantenimiento.dto';

@Controller('avisos-mantenimiento')
export class AvisosMantenimientoController {
  constructor(private readonly avisosMantenimientoService: AvisosMantenimientoService) {}

  @Post()
  create(@Body() createAvisosMantenimientoDto: CreateAvisosMantenimientoDto) {
    return this.avisosMantenimientoService.create(createAvisosMantenimientoDto);
  }

  @Get()
  findAll() {
    return this.avisosMantenimientoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.avisosMantenimientoService.findOne(+id);
  }

}
