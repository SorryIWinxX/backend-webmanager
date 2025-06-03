import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Item } from './entities/item.entity';
import { LongText } from '../long_text/entities/long_text.entity';
import { Inspeccion } from '../inspeccion/entities/inspeccion.entity';
import { AvisoMantenimiento } from '../avisos_mantenimiento/entities/aviso-mantenimiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, LongText, Inspeccion, AvisoMantenimiento])],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
