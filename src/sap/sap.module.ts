import { Module } from '@nestjs/common';
import { SapService } from './sap.service';
import { SapController } from './sap.controller';
import { AvisosMantenimientoModule } from 'src/avisos_mantenimiento/avisos_mantenimiento.module';

@Module({
  imports: [AvisosMantenimientoModule],
  controllers: [SapController],
  providers: [SapService],
})
export class SapModule {}
