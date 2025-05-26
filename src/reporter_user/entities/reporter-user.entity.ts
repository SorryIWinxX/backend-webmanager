import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { PuestoTrabajo } from 'src/puesto_trabajo/entities/puesto-trabajo.entity';
import { AvisoMantenimiento } from 'src/avisos_mantenimiento/entities/aviso-mantenimiento.entity';

@Entity('reporter_user')
export class ReporterUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: string; 

  @ManyToOne(() => PuestoTrabajo, (puestoTrabajo: PuestoTrabajo) => puestoTrabajo.id)
  puestoTrabajo: PuestoTrabajo;

  @OneToMany(() => AvisoMantenimiento, (avisoMantenimiento: AvisoMantenimiento) => avisoMantenimiento.reporterUser)
  avisosMantenimiento: AvisoMantenimiento[];
} 