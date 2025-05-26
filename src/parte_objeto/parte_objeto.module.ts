import { Module } from '@nestjs/common';
import { ParteObjetoService } from './parte_objeto.service';
import { ParteObjetoController } from './parte_objeto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParteObjeto } from './entities/parte-objeto.entity';
import { Sensor } from 'src/sensor/entities/sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParteObjeto, Sensor])],
  controllers: [ParteObjetoController],
  providers: [ParteObjetoService],
})
export class ParteObjetoModule {}
