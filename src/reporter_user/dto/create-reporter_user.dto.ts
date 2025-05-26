import { IsNotEmpty, IsNumber } from "class-validator";

import { IsString } from "class-validator";

export class CreateReporterUserDto {
    @IsString()
    @IsNotEmpty()
    cedula: string;

    @IsNumber()
    @IsNotEmpty()
    puestoTrabajo: number;
    
}
