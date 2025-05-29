import { Module } from '@nestjs/common';
import { SapService } from './sap.service';
import { SapController } from './sap.controller';
import { AvisosMantenimientoModule } from 'src/avisos_mantenimiento/avisos_mantenimiento.module';
import { InspeccionModule } from 'src/inspeccion/inspeccion.module';
import { EquiposModule } from 'src/equipos/equipos.module';
import { MaterialModule } from 'src/material/material.module';
import { TipoAvisosModule } from 'src/tipo_avisos/tipo_avisos.module';

@Module({
  imports: [AvisosMantenimientoModule, InspeccionModule, EquiposModule, MaterialModule, TipoAvisosModule],
  controllers: [SapController],
  providers: [SapService],
})
export class SapModule {}
