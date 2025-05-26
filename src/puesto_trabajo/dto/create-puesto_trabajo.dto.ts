import { IsString } from "class-validator";

import { IsNotEmpty } from "class-validator";

export class CreatePuestoTrabajoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
}
