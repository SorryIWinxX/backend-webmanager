import { Injectable } from '@nestjs/common';
import { AvisosMantenimientoService } from 'src/avisos_mantenimiento/avisos_mantenimiento.service';

@Injectable()
export class SapService {
  constructor(
    private readonly avisosMantenimientoService: AvisosMantenimientoService,
  ) {}

  async enviarAvisoMantenimiento(id: number) {
    return this.avisosMantenimientoService.findOne(id);
  }

  async sincronizarAvisosMantenimiento() {
    return 'This action synchronizes avisos mantenimiento';
  }
}
