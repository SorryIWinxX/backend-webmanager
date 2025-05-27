import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateParteObjetoDto {
    @ApiProperty({
        description: 'Name of the object part',
        example: 'Rodamiento Principal',
        type: String,
        maxLength: 255
    })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({
        description: 'ID of the sensor associated with this object part',
        example: 1,
        type: Number,
        minimum: 1
    })
    @IsNumber()
    @IsNotEmpty()
    sensor: number;
}
