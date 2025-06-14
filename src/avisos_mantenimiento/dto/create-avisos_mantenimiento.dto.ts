import { IsDate, IsNumber, IsOptional, IsString, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CreateLongTextDto } from "../../long_text/dto/create-long_text.dto";

// DTO para los items del aviso de mantenimiento
export class CreateItemForAvisoDto {
  @ApiProperty({
    description: 'Array of inspection ID arrays - each sub-array represents a set of inspections',
    example: [
      [72, 283, 707],
      [72, 283, 707],
      [72, 283, 707]
    ]
  })
  @IsArray()
  @IsArray({ each: true })
  inspeccionIds: number[][];

  @ApiProperty({
    description: 'Array of long text objects - must match the number of inspection sets',
    type: [CreateLongTextDto],
    example: [
      {
        "linea": "line1",
        "textLine": "Esta es la línea de inspección 1"
      },
      {
        "linea": "line2", 
        "textLine": "Esta es la línea de inspección 2"
      },
      {
        "linea": "line3",
        "textLine": "Esta es la línea de inspección 3"
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLongTextDto)
  longTextIds: CreateLongTextDto[];
}

export class CreateAvisosMantenimientoDto {

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
    description: 'ID of the reporter user who identified the issue',
    example: 1,
    type: Number,
    minimum: 1
  })
  @IsNumber()
  reporterUser: number;

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
    example: 'Bomba centrífuga presenta',
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

  @ApiProperty({
    description: 'Array of items with inspections and long texts',
    type: [CreateItemForAvisoDto],
    example: [
      {
        "inspeccionIds": [
          [72, 283, 707],
          [72, 283, 707],
          [72, 283, 707]
        ],
        "longTextIds": [
          {
            "linea": "line1",
            "textLine": "Esta es la línea de inspección 1"
          },
          {
            "linea": "line2",
            "textLine": "Esta es la línea de inspección 2"
          },
          {
            "linea": "line3",
            "textLine": "Esta es la línea de inspección 3"
          }
        ]
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemForAvisoDto)
  items: CreateItemForAvisoDto[];
}
