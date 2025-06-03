import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLongTextDto {
  

  @ApiProperty({ description: 'Línea', maxLength: 5 })
  @IsString()
  @IsNotEmpty()
  linea: string;



  @ApiProperty({ description: 'Línea de texto' })
  @IsString()
  @IsNotEmpty()
  textLine: string;
}
