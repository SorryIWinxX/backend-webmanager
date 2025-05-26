import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PuestoTrabajoService } from './puesto_trabajo.service';
import { CreatePuestoTrabajoDto } from './dto/create-puesto_trabajo.dto';

@Controller('puesto-trabajo')
export class PuestoTrabajoController {
  constructor(private readonly puestoTrabajoService: PuestoTrabajoService) {}

  @Post()
  create(@Body() createPuestoTrabajoDto: CreatePuestoTrabajoDto) {
    return this.puestoTrabajoService.create(createPuestoTrabajoDto);
  }

  @Get()
  findAll() {
    return this.puestoTrabajoService.findAll();
  }

  
}
