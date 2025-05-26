import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ParteObjeto } from "src/parte_objeto/entities/parte-objeto.entity";

@Entity('sensor')
export class Sensor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @OneToMany(() => ParteObjeto, (parteObjeto: ParteObjeto) => parteObjeto.sensor)
    partesObjeto: ParteObjeto[];
}
