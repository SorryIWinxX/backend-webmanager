import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateInspeccionDto {
    @ApiProperty({
        description: 'Código del grupo de inspección',
        example: 'AIREACA',
        type: String,
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty()
    codigoGrupo: string;

    @ApiProperty({
        description: 'Catalog identifier',
        example: 'B',
        type: String,
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty()
    catalogo: string;

    @ApiProperty({
        description: 'Inspection code',
        example: '0010',
        type: String,
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty()
    codigo: string;
    
    @ApiProperty({
        description: 'Descripción de la inspección',
        example: 'VENTILADOR',
        type: String,
        maxLength: 500
    })
    @IsString()
    @IsNotEmpty()
    descripcion: string;
}
