import { Entity, Column, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn, Unique } from 'typeorm';
import { AvisoMantenimiento } from 'src/avisos_mantenimiento/entities/aviso-mantenimiento.entity';

@Entity('master_user')
export class MasterUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique(['username'])
  @Column()
  username: string;

  @Column()
  password: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => AvisoMantenimiento, (avisoMantenimiento: AvisoMantenimiento) => avisoMantenimiento.masterUser)
  avisosMantenimiento: AvisoMantenimiento[];
} 