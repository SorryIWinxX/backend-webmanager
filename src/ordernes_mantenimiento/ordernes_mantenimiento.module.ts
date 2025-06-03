import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdernesMantenimientoService } from './ordernes_mantenimiento.service';
import { OrdernesMantenimientoController } from './ordernes_mantenimiento.controller';
import { OrdernesMantenimiento } from './entities/ordernes_mantenimiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdernesMantenimiento])],
  controllers: [OrdernesMantenimientoController],
  providers: [OrdernesMantenimientoService],
  exports: [OrdernesMantenimientoService],
})
export class OrdernesMantenimientoModule {}
