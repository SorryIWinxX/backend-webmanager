import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { MasterUser } from '../../master_user/entities/master-user.entity';
import { TipoAviso } from 'src/tipo_avisos/entities/tipo-aviso.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { ParteObjeto } from 'src/parte_objeto/entities/parte-objeto.entity';
import { ReporterUser } from 'src/reporter_user/entities/reporter-user.entity';
import { Inspeccion } from 'src/inspeccion/entities/inspeccion.entity';
import { Material } from 'src/material/entities/material.entity';

@Entity('avisos_mantenimiento')
export class AvisoMantenimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: null })
  numeroExt: string;
  
  @ManyToOne(() => TipoAviso, (tipoAviso) => tipoAviso.id, {
    eager: true,
  })
  tipoAviso: TipoAviso;

  @ManyToOne(() => MasterUser, (masterUser) => masterUser.id, {
    eager: true,
  })
  masterUser: MasterUser;

  @ManyToOne(() => Equipo, (equipo) => equipo.id, {
    eager: true,
  })
  equipo: Equipo;

  @ManyToOne(() => ParteObjeto, (parteObjeto) => parteObjeto.id, {
    eager: true,
  })
  parteObjeto: ParteObjeto;

  @ManyToOne(() => ReporterUser, (reporterUser) => reporterUser.id, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  reporterUser: ReporterUser;

  @ManyToOne(() => Inspeccion, (inspeccion) => inspeccion.id, {
    eager: true,
  })
  inspeccion: Inspeccion;

  @ManyToOne(() => Material, (material) => material.id, {
    eager: true,
  })
  material: Material;

  @Column({ type: 'text' })
  textoBreve: string;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date', nullable: true })
  fechaFin: Date;

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time', nullable: true })
  horaFin: string;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'enviado', 'fallido'],
    default: 'pendiente'
  })
  estado: 'pendiente' | 'enviado' | 'fallido';

  @Column({ nullable: true })
  numeroSap: string;
} 