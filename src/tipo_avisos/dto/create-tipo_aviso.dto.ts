import { IsNotEmpty, IsString } from "class-validator";

export class CreateTipoAvisoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
}
