import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('avisos_creados')
export class AvisoCreado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'qmnum', length: 50, comment: 'Número de aviso' })
  qmnum: string;

  @Column({ name: 'qmart', length: 10, comment: 'Tipo de aviso' })
  qmart: string;

  @Column({ name: 'equnr', length: 50, nullable: true, comment: 'Número de equipo' })
  equnr: string;

  @Column({ name: 'tplnr', length: 50, nullable: true, comment: 'Ubicación técnica' })
  tplnr: string;

  @Column({ name: 'qmtxt', type: 'text', nullable: true, comment: 'Texto del aviso' })
  qmtxt: string;

  @Column({ name: 'bautl', length: 100, nullable: true, comment: 'Autor' })
  bautl: string;

  @Column({ name: 'strmn', type: 'date', nullable: true, comment: 'Fecha de inicio' })
  strmn: Date;

  @Column({ name: 'strur', type: 'time', nullable: true, comment: 'Hora de inicio' })
  strur: string;

  @Column({ name: 'ltrmn', type: 'date', nullable: true, comment: 'Fecha de fin' })
  ltrmn: Date;

  @Column({ name: 'ltrur', type: 'time', nullable: true, comment: 'Hora de fin' })
  ltrur: string;

  @Column({ name: 'arbpl', length: 20, nullable: true, comment: 'Puesto de trabajo' })
  arbpl: string;

  @Column({ name: 'qmnam', length: 100, nullable: true, comment: 'Responsable del aviso' })
  qmnam: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
