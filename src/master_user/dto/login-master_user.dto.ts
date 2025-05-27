import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginMasterUserDto {
    @ApiProperty({
        description: 'Username for master user authentication',
        example: 'admin_user',
        type: String
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'Password for master user authentication',
        example: 'securePassword123',
        type: String
    })
    @IsString()
    @IsNotEmpty()
    password: string;
} 