import { Controller, Get, Post, Body } from '@nestjs/common';
import { ParteObjetoService } from './parte_objeto.service';
import { CreateParteObjetoDto } from './dto/create-parte_objeto.dto';

@Controller('parte-objeto')
export class ParteObjetoController {
  constructor(private readonly parteObjetoService: ParteObjetoService) {}

  @Post()
  create(@Body() createParteObjetoDto: CreateParteObjetoDto) {
    return this.parteObjetoService.create(createParteObjetoDto);
  }

  @Get()
  findAll() {
    return this.parteObjetoService.findAll();
  }

}
