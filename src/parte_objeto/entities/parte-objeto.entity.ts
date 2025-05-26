import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Sensor } from 'src/sensor/entities/sensor.entity';
import { AvisoMantenimiento } from 'src/avisos_mantenimiento/entities/aviso-mantenimiento.entity';

@Entity('parte_objeto')
export class ParteObjeto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Sensor, (sensor: Sensor) => sensor.id, {
    eager: true,
  })
  sensor: Sensor;

  @OneToMany(() => AvisoMantenimiento, (avisoMantenimiento: AvisoMantenimiento) => avisoMantenimiento.parteObjeto)
  avisosMantenimiento: AvisoMantenimiento[];
} 