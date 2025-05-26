import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateParteObjetoDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsNumber()
    @IsNotEmpty()
    sensor: number;
}
