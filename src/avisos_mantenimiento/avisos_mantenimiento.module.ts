import { Module } from '@nestjs/common';
import { AvisosMantenimientoService } from './avisos_mantenimiento.service';
import { AvisosMantenimientoController } from './avisos_mantenimiento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvisoMantenimiento } from './entities/aviso-mantenimiento.entity';
import { MasterUser } from 'src/master_user/entities/master-user.entity';
import { TipoAviso } from 'src/tipo_avisos/entities/tipo-aviso.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { ParteObjeto } from 'src/parte_objeto/entities/parte-objeto.entity';
import { ReporterUser } from 'src/reporter_user/entities/reporter-user.entity';
import { UbicacionTecnica } from 'src/ubicacion_tecnica/entities/ubicacion-tecnica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AvisoMantenimiento, MasterUser, TipoAviso, Equipo, ParteObjeto, ReporterUser, UbicacionTecnica])],
  controllers: [AvisosMantenimientoController],
  providers: [AvisosMantenimientoService],
  exports: [AvisosMantenimientoService]
})
export class AvisosMantenimientoModule {}
