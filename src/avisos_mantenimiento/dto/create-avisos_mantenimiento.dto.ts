import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateAvisosMantenimientoDto {
  @ApiPropertyOptional({
    description: 'External number for the maintenance notice (optional)',
    example: 'EXT-2024-001',
    type: String,
    nullable: true
  })
  @IsOptional()
  @IsString()
  numeroExt?: string;

  @ApiProperty({
    description: 'ID of the master user creating the notice',
    example: 1,
    type: Number,
    minimum: 1
  })
  @IsNumber()
  masterUser: number;

  @ApiProperty({
    description: 'ID of the notice type',
    example: 1,
    type: Number,
    minimum: 1
  })
  @IsNumber()
  tipoAviso: number;

  @ApiProperty({
    description: 'ID of the equipment related to the maintenance notice',
    example: 1,
    type: Number,
    minimum: 1
  })
  @IsNumber()
  equipo: number;

  @ApiProperty({
    description: 'ID of the object part that requires maintenance',
    example: 1,
    type: Number,
    minimum: 1
  })
  @IsNumber()
  parteObjeto: number;

  @ApiProperty({
    description: 'ID of the reporter user who identified the issue',
    example: 1,
    type: Number,
    minimum: 1
  })
  @IsNumber()
  reporterUser: number;

  @ApiProperty({
    description: 'ID of the inspection procedure to be followed',
    example: 1,
    type: Number,
    minimum: 1
  })
  @IsNumber()
  inspeccion: number;

  @ApiProperty({
    description: 'ID of the material required for maintenance',
    example: 1,
    type: Number,
    minimum: 1
  })
  @IsNumber()
  material: number;

  @ApiProperty({
    description: 'Brief description of the maintenance issue',
    example: 'Bomba centrífuga presenta ruido anormal y vibración excesiva',
    type: String,
    maxLength: 500
  })
  @IsString()
  textoBreve: string;

  @ApiProperty({
    description: 'Start date for the maintenance work',
    example: '2024-01-15',
    type: Date,
    format: 'date'
  })
  @Type(() => Date)
  @IsDate()
  fechaInicio: Date;

  @ApiPropertyOptional({
    description: 'End date for the maintenance work (optional)',
    example: '2024-01-16',
    type: Date,
    format: 'date',
    nullable: true
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaFin?: Date;

  @ApiProperty({
    description: 'Start time for the maintenance work',
    example: '08:00:00',
    type: String,
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$'
  })
  @IsString()
  horaInicio: string;

  @ApiPropertyOptional({
    description: 'End time for the maintenance work (optional)',
    example: '17:00:00',
    type: String,
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$',
    nullable: true
  })
  @IsOptional()
  @IsString()
  horaFin?: string;
}
