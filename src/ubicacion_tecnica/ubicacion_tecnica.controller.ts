import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UbicacionTecnicaService } from './ubicacion_tecnica.service';
import { CreateUbicacionTecnicaDto } from './dto/create-ubicacion_tecnica.dto';

@Controller('ubicacion-tecnica')
export class UbicacionTecnicaController {
  constructor(private readonly ubicacionTecnicaService: UbicacionTecnicaService) {}

  @Post()
  create(@Body() createUbicacionTecnicaDto: CreateUbicacionTecnicaDto) {
    return this.ubicacionTecnicaService.create(createUbicacionTecnicaDto);
  }

  @Get()
  findAll() {
    return this.ubicacionTecnicaService.findAll();
  }
 
}
