import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEquipoDto {
    @ApiProperty({
        description: 'Unique equipment number or identifier',
        example: 'BOMBA-CENT-001',
        type: String,
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty()
    numeroEquipo: string;

    @ApiProperty({
        description: 'Physical or technical location where the equipment is installed',
        example: 'PLANTA-AGUA/SECTOR-A/NIVEL-1',
        type: String,
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty()
    ubicacionTecnica: string;

    @ApiProperty({
        description: 'Work center or position responsible for this equipment',
        example: 'MANT-MECANICO-TURNO-A',
        type: String,
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty()
    puestoTrabajo: string;

    @ApiProperty({
        description: 'Equipment catalog profile defining maintenance procedures',
        example: 'PERFIL-BOMBA-CENTRIFUGA',
        type: String,
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty()
    perfilCatalogo: string;
  
    @ApiProperty({
        description: 'Technical object classification in the maintenance system',
        example: 'BOMBA-AGUA-POTABLE',
        type: String,
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty()
    objetoTecnico: string;
   

   

    
}
