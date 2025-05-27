import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTipoAvisoDto {
    @ApiProperty({
        description: 'Name of the notice type',
        example: 'Mantenimiento Preventivo',
        type: String,
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({
        description: 'Detailed description of the notice type',
        example: 'Mantenimiento programado para prevenir fallas en equipos críticos',
        type: String,
        maxLength: 500
    })
    @IsString()
    @IsNotEmpty()
    descripcion: string;
}
