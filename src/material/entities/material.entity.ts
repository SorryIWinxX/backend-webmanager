import { AvisoMantenimiento } from "src/avisos_mantenimiento/entities/aviso-mantenimiento.entity";
import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity('material')
export class Material {
    @ApiProperty({
        description: 'Unique identifier for the material',
        example: 1,
        type: Number
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Material set or assembly identifier',
        example: 'CONJUNTO-BOMBA-001',
        type: String
    })
    @Column()
    conjunto: string;

    @ApiProperty({
        description: 'Detailed description of the material or component',
        example: 'Conjunto completo de bomba centrífuga con motor eléctrico 5HP',
        type: String
    })
    @Column()
    description: string;

    @ApiProperty({
        description: 'List of maintenance notices associated with this material',
        type: () => [AvisoMantenimiento],
        isArray: true
    })
    @OneToMany(() => AvisoMantenimiento, (avisoMantenimiento: AvisoMantenimiento) => avisoMantenimiento.material)
    avisosMantenimiento: AvisoMantenimiento[];
}
