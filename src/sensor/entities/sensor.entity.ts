import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ParteObjeto } from "src/parte_objeto/entities/parte-objeto.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('sensor')
export class Sensor {
    @ApiProperty({
        description: 'Unique identifier for the sensor',
        example: 1,
        type: Number
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Name of the sensor',
        example: 'Sensor de Vibración VB-001',
        type: String
    })
    @Column()
    nombre: string;

    @ApiProperty({
        description: 'List of object parts associated with this sensor',
        type: () => [ParteObjeto],
        isArray: true
    })
    @OneToMany(() => ParteObjeto, (parteObjeto: ParteObjeto) => parteObjeto.sensor)
    partesObjeto: ParteObjeto[];
}
