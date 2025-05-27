import { AvisoMantenimiento } from "src/avisos_mantenimiento/entities/aviso-mantenimiento.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('inspeccion')
export class Inspeccion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    catalogo: string;

    @Column()
    codigo: string;

    @Column()
    descripcion: string;

    @Column()
    catalago2: string;

    @OneToMany(() => AvisoMantenimiento, (avisoMantenimiento: AvisoMantenimiento) => avisoMantenimiento.inspeccion)
    avisosMantenimiento: AvisoMantenimiento[];
}
