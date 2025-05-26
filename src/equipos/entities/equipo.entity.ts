import { AvisoMantenimiento } from 'src/avisos_mantenimiento/entities/aviso-mantenimiento.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('equipo')
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => AvisoMantenimiento, (avisoMantenimiento: AvisoMantenimiento) => avisoMantenimiento.equipo)
  avisosMantenimiento: AvisoMantenimiento[];
}
