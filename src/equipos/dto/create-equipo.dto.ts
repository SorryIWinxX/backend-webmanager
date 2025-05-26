import { IsNotEmpty, IsString } from "class-validator";

export class CreateEquipoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

}
