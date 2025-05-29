import { IsNotEmpty, IsArray, IsNumber } from "class-validator";

export class SendSapDto {
    @IsArray()
    @IsNumber({}, { each: true })
    @IsNotEmpty()
    avisosMantenimiento: Array<number>;

}
