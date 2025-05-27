import { Module } from '@nestjs/common';
import { InspeccionService } from './inspeccion.service';
import { InspeccionController } from './inspeccion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inspeccion } from './entities/inspeccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inspeccion])],
  controllers: [InspeccionController],
  providers: [InspeccionService],
})
export class InspeccionModule {}
