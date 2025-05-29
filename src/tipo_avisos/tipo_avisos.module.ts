import { Module } from '@nestjs/common';
import { TipoAvisosService } from './tipo_avisos.service';
import { TipoAvisosController } from './tipo_avisos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoAviso } from './entities/tipo-aviso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoAviso])],
  controllers: [TipoAvisosController],
  providers: [TipoAvisosService],
  exports: [TipoAvisosService],
})
export class TipoAvisosModule {}
