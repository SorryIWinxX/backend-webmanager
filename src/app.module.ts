import { Module } from '@nestjs/common';
import { MasterUserModule } from './master_user/master_user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvisosMantenimientoModule } from './avisos_mantenimiento/avisos_mantenimiento.module';
import { TipoAvisosModule } from './tipo_avisos/tipo_avisos.module';
import { EquiposModule } from './equipos/equipos.module';
import { UbicacionTecnicaModule } from './ubicacion_tecnica/ubicacion_tecnica.module';
import { PuestoTrabajoModule } from './puesto_trabajo/puesto_trabajo.module';
import { ReporterUserModule } from './reporter_user/reporter_user.module';
import { ParteObjetoModule } from './parte_objeto/parte_objeto.module';
import { OrdernesMantenimientoModule } from './ordernes_mantenimiento/ordernes_mantenimiento.module';
import { SensorModule } from './sensor/sensor.module';
import { SapModule } from './sap/sap.module';

@Module({
  imports: [
    MasterUserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3306'),
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '9192',
      database: process.env.DB_NAME ?? 'db_seppat',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AvisosMantenimientoModule,
    TipoAvisosModule,
    EquiposModule,
    UbicacionTecnicaModule,
    PuestoTrabajoModule,
    ReporterUserModule,
    ParteObjetoModule,
    SensorModule,
    OrdernesMantenimientoModule,
    SapModule,
  ],

})
export class AppModule {}
