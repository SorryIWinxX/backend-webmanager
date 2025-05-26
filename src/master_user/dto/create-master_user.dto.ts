import { IsNotEmpty } from "class-validator";

import { IsString } from "class-validator";
import { DeleteDateColumn } from "typeorm";

export class CreateMasterUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

   
}
