import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AvisoMantenimiento } from 'src/avisos_mantenimiento/entities/aviso-mantenimiento.entity';

@Entity('tipo_aviso')
export class TipoAviso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @OneToMany(() => AvisoMantenimiento, (avisoMantenimiento: AvisoMantenimiento) => avisoMantenimiento.tipoAviso)
  avisosMantenimiento: AvisoMantenimiento[];
} 