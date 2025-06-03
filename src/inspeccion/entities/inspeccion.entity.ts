import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('inspeccion')
export class Inspeccion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    codigoGrupo: string;

    @Column()
    catalogo: string;

    @Column()
    codigo: string;

    @Column()
    descripcion: string;
}
