import { IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePuestoTrabajoDto {
    @ApiProperty({
        description: 'Name of the work position',
        example: 'Técnico de Mantenimiento Mecánico',
        type: String,
        maxLength: 255
    })
    @IsString()
    @IsNotEmpty()
    nombre: string;
}
