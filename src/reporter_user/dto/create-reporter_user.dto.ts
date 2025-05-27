import { IsNotEmpty, IsNumber } from "class-validator";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReporterUserDto {
    @ApiProperty({
        description: 'Identification number (cedula) of the reporter user',
        example: '12345678',
        type: String,
        minLength: 7,
        maxLength: 15
    })
    @IsString()
    @IsNotEmpty()
    cedula: string;

    @ApiProperty({
        description: 'ID of the work position assigned to this reporter user',
        example: 1,
        type: Number,
        minimum: 1
    })
    @IsNumber()
    @IsNotEmpty()
    puestoTrabajo: number;
    
}
