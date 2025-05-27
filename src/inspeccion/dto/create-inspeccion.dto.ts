import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateInspeccionDto {
    @ApiProperty({
        description: 'Inspection catalog identifier',
        example: 'CAT-INSP-001',
        type: String,
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty()
    catalogo: string;

    @ApiProperty({
        description: 'Inspection code',
        example: 'INSP-VIB-001',
        type: String,
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty()
    codigo: string;
    
    @ApiProperty({
        description: 'Detailed description of the inspection procedure',
        example: 'Inspección de vibración en rodamientos principales',
        type: String,
        maxLength: 500
    })
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @ApiProperty({
        description: 'Secondary catalog identifier',
        example: 'CAT-SEC-001',
        type: String,
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty()
    catalago2: string;
}
