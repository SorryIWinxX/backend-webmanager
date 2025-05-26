import { IsNotEmpty, IsString } from "class-validator";

export class CreateUbicacionTecnicaDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
}
