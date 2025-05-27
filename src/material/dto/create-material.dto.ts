import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class CreateMaterialDto {
    @ApiProperty({
        description: 'Material set or assembly identifier',
        example: 'CONJUNTO-BOMBA-001',
        type: String,
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty()
    conjunto: string;

    @ApiProperty({
        description: 'Detailed description of the material or component',
        example: 'Conjunto completo de bomba centrífuga con motor eléctrico 5HP',
        type: String,
        maxLength: 500
    })
    @IsString()
    @IsNotEmpty()
    description: string;
}
