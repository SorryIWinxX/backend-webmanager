import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMasterUserDto {
    @ApiProperty({
        description: 'Username for the master user account',
        example: 'admin_user',
        type: String,
        minLength: 3,
        maxLength: 50
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'Password for the master user account',
        example: 'SecurePassword123!',
        type: String,
        minLength: 8,
        maxLength: 100,
        format: 'password'
    })
    @IsString()
    @IsNotEmpty()
    password: string;

   
}
