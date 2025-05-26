import { IsNotEmpty } from "class-validator";

import { IsString } from "class-validator";

export class CreateSensorDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
    
}
