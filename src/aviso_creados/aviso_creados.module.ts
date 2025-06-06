import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvisoCreadosService } from './aviso_creados.service';
import { AvisoCreadosController } from './aviso_creados.controller';
import { AvisoCreado } from './entities/aviso_creado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AvisoCreado])],
  controllers: [AvisoCreadosController],
  providers: [AvisoCreadosService],
  exports: [AvisoCreadosService],
})
export class AvisoCreadosModule {}
