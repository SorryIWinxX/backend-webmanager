import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { ReporterUser } from 'src/reporter_user/entities/reporter-user.entity';
import { AvisoMantenimiento } from 'src/avisos_mantenimiento/entities/aviso-mantenimiento.entity';

@Entity('puesto_trabajo')
export class PuestoTrabajo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => ReporterUser, (reporterUser: ReporterUser) => reporterUser.puestoTrabajo)
  reporterUsers: ReporterUser[];
} 