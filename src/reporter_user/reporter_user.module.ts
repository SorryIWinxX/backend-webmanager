import { Module } from '@nestjs/common';
import { ReporterUserService } from './reporter_user.service';
import { ReporterUserController } from './reporter_user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporterUser } from './entities/reporter-user.entity';
import { PuestoTrabajo } from 'src/puesto_trabajo/entities/puesto-trabajo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReporterUser, PuestoTrabajo])],
  controllers: [ReporterUserController],
  providers: [ReporterUserService],
})
export class ReporterUserModule {}
