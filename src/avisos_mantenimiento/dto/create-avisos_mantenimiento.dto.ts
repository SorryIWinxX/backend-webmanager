import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateAvisosMantenimientoDto {
  @IsOptional()
  @IsString()
  numeroExt?: string;

  @IsNumber()
  masterUser: number;

  @IsNumber()
  tipoAviso: number;

  @IsNumber()
  equipo: number;

  @IsNumber()
  parteObjeto: number;

  @IsNumber()
  reporterUser: number;

  @IsNumber()
  ubicacionTecnica: number;

  @IsString()
  textoBreve: string;

  @Type(() => Date)
  @IsDate()
  fechaInicio: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaFin?: Date;

  @IsString()
  horaInicio: string;

  @IsOptional()
  @IsString()
  horaFin?: string;

  
}
