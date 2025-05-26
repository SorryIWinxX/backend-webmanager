import { Module } from '@nestjs/common';
import { UbicacionTecnicaService } from './ubicacion_tecnica.service';
import { UbicacionTecnicaController } from './ubicacion_tecnica.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UbicacionTecnica } from './entities/ubicacion-tecnica.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UbicacionTecnica])],
  controllers: [UbicacionTecnicaController],
  providers: [UbicacionTecnicaService],
})
export class UbicacionTecnicaModule {}
