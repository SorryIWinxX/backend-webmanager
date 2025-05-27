import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSensorDto {
    @ApiProperty({
        description: 'Name of the sensor',
        example: 'Sensor de Vibración VB-001',
        type: String,
        maxLength: 255
    })
    @IsString()
    @IsNotEmpty()
    nombre: string;
    
}
