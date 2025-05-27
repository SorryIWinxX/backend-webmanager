import { AvisoMantenimiento } from 'src/avisos_mantenimiento/entities/aviso-mantenimiento.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('equipo')
export class Equipo {
  @ApiProperty({
    description: 'Unique identifier for the equipment',
    example: 1,
    type: Number
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique equipment number or identifier',
    example: 'BOMBA-CENT-001',
    type: String
  })
  @Column()
  numeroEquipo: string;

  @ApiProperty({
    description: 'Physical or technical location where the equipment is installed',
    example: 'PLANTA-AGUA/SECTOR-A/NIVEL-1',
    type: String
  })
  @Column()
  ubicacionTecnica: string;

  @ApiProperty({
    description: 'Work center or position responsible for this equipment',
    example: 'MANT-MECANICO-TURNO-A',
    type: String
  })
  @Column()
  puestoTrabajo: string;

  @ApiProperty({
    description: 'Equipment catalog profile defining maintenance procedures',
    example: 'PERFIL-BOMBA-CENTRIFUGA',
    type: String
  })
  @Column()
  perfilCatalogo: string;

  @ApiProperty({
    description: 'Technical object classification in the maintenance system',
    example: 'BOMBA-AGUA-POTABLE',
    type: String
  })
  @Column()
  objetoTecnico: string;

  @ApiProperty({
    description: 'List of maintenance notices associated with this equipment',
    type: () => [AvisoMantenimiento],
    isArray: true
  })
  @OneToMany(() => AvisoMantenimiento, (avisoMantenimiento: AvisoMantenimiento) => avisoMantenimiento.equipo)
  avisosMantenimiento: AvisoMantenimiento[];
}
