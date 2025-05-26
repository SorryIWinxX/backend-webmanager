import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SapService } from './sap.service';

@Controller('sap')
export class SapController {
  constructor(private readonly sapService: SapService) {}

  @Post('enviar-aviso-mantenimiento/:id')
  enviarAvisoMantenimiento(@Param('id') id: number) {
    return this.sapService.enviarAvisoMantenimiento(id);
  }

  @Get('sincronizar-tablas')
  sincronizarAvisosMantenimiento() {
    return this.sapService.sincronizarAvisosMantenimiento();
  }

}
