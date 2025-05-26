import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AvisoMantenimiento } from 'src/avisos_mantenimiento/entities/aviso-mantenimiento.entity';

@Entity('ubicacion_tecnica')
export class UbicacionTecnica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => AvisoMantenimiento, (avisoMantenimiento: AvisoMantenimiento) => avisoMantenimiento.ubicacionTecnica)
  avisosMantenimiento: AvisoMantenimiento[];
} 