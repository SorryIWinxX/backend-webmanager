import { Module } from '@nestjs/common';
import { OrdernesMantenimientoService } from './ordernes_mantenimiento.service';
import { OrdernesMantenimientoController } from './ordernes_mantenimiento.controller';

@Module({
  controllers: [OrdernesMantenimientoController],
  providers: [OrdernesMantenimientoService],
})
export class OrdernesMantenimientoModule {}
