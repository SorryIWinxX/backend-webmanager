import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum EstadoOrden {
  PLANIFICADA = 'planificada',
  EN_PROGRESO = 'en_progreso',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada'
}

export enum PrioridadOrden {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
  CRITICA = 'critica'
}

export class CreateOrdernesMantenimientoDto {
  @ApiProperty({
    description: 'ID of the maintenance notice that originated this order',
    example: 1,
    type: Number,
    minimum: 1
  })
  @IsNumber()
  avisoMantenimiento: number;

  @ApiProperty({
    description: 'Order number (auto-generated if not provided)',
    example: 'ORD-2024-001',
    type: String,
    maxLength: 50
  })
  @IsString()
  numeroOrden: string;

  @ApiProperty({
    description: 'Brief description of the maintenance work to be performed',
    example: 'Reemplazo de rodamientos en bomba centrífuga',
    type: String,
    maxLength: 500
  })
  @IsString()
  descripcionTrabajo: string;

  @ApiProperty({
    description: 'Priority level of the maintenance order',
    enum: PrioridadOrden,
    example: PrioridadOrden.ALTA,
    enumName: 'PrioridadOrden'
  })
  @IsEnum(PrioridadOrden)
  prioridad: PrioridadOrden;

  @ApiProperty({
    description: 'Current status of the maintenance order',
    enum: EstadoOrden,
    example: EstadoOrden.PLANIFICADA,
    enumName: 'EstadoOrden'
  })
  @IsEnum(EstadoOrden)
  estado: EstadoOrden;

  @ApiProperty({
    description: 'Planned start date for the maintenance work',
    example: '2024-01-15',
    type: Date,
    format: 'date'
  })
  @Type(() => Date)
  @IsDate()
  fechaInicioPlaneada: Date;

  @ApiProperty({
    description: 'Planned end date for the maintenance work',
    example: '2024-01-16',
    type: Date,
    format: 'date'
  })
  @Type(() => Date)
  @IsDate()
  fechaFinPlaneada: Date;

  @ApiPropertyOptional({
    description: 'Actual start date of the maintenance work (optional)',
    example: '2024-01-15',
    type: Date,
    format: 'date',
    nullable: true
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaInicioReal?: Date;

  @ApiPropertyOptional({
    description: 'Actual end date of the maintenance work (optional)',
    example: '2024-01-16',
    type: Date,
    format: 'date',
    nullable: true
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaFinReal?: Date;

  @ApiProperty({
    description: 'Estimated duration in hours',
    example: 8,
    type: Number,
    minimum: 0.5
  })
  @IsNumber()
  duracionEstimada: number;

  @ApiPropertyOptional({
    description: 'Actual duration in hours (optional)',
    example: 10,
    type: Number,
    minimum: 0,
    nullable: true
  })
  @IsOptional()
  @IsNumber()
  duracionReal?: number;

  @ApiProperty({
    description: 'ID of the technician assigned to this order',
    example: 1,
    type: Number,
    minimum: 1
  })
  @IsNumber()
  tecnicoAsignado: number;

  @ApiPropertyOptional({
    description: 'Additional notes or observations (optional)',
    example: 'Verificar alineación después del reemplazo',
    type: String,
    maxLength: 1000,
    nullable: true
  })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiPropertyOptional({
    description: 'Estimated cost of the maintenance work (optional)',
    example: 1500.50,
    type: Number,
    minimum: 0,
    nullable: true
  })
  @IsOptional()
  @IsNumber()
  costoEstimado?: number;
}
