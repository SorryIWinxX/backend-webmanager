import { Module } from '@nestjs/common';
import { PuestoTrabajoService } from './puesto_trabajo.service';
import { PuestoTrabajoController } from './puesto_trabajo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuestoTrabajo } from './entities/puesto-trabajo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PuestoTrabajo])],
  controllers: [PuestoTrabajoController],
  providers: [PuestoTrabajoService],
})
export class PuestoTrabajoModule {}
