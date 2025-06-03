import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLongTextDto } from '../../long_text/dto/create-long_text.dto';
import { CreateInspeccionDto } from '../../inspeccion/dto/create-inspeccion.dto';

export class CreateItemDto {
  @IsOptional()
  @IsString()
  SUBCO?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLongTextDto)
  longTexts?: CreateLongTextDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInspeccionDto)
  inspecciones?: CreateInspeccionDto[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  inspeccionIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  avisoMantenimientoIds?: number[];
}
