import { IsString, IsOptional, IsDateString, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateOrdernesMantenimientoDto {
  @ApiProperty({
    description: 'Order ID from SAP system',
    example: '000004013308',
    type: String,
    maxLength: 50
  })
  @IsString()
  orderId: string;

  @ApiPropertyOptional({
    description: 'Order type (e.g., PM02)',
    example: 'PM02',
    type: String,
    maxLength: 10
  })
  @IsOptional()
  @IsString()
  orderType?: string;

  @ApiPropertyOptional({
    description: 'Notification number',
    example: '000010014036',
    type: String,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  notifNo?: string;

  @ApiPropertyOptional({
    description: 'User who entered the order',
    example: 'IP1020231027',
    type: String,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  enteredBy?: string;

  @ApiPropertyOptional({
    description: 'Date when the order was entered',
    example: '2023-10-27',
    type: String,
    format: 'date'
  })
  @IsOptional()
  @IsDateString()
  enterDate?: string;

  @ApiPropertyOptional({
    description: 'User who last changed the order',
    example: 'USER123',
    type: String,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  changedBy?: string;

  @ApiPropertyOptional({
    description: 'Short text description of the order',
    example: 'PLAN PREVENTIVO 1',
    type: String,
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  shortText?: string;

  @ApiPropertyOptional({
    description: 'ABC indicator',
    example: 'A',
    type: String,
    maxLength: 10
  })
  @IsOptional()
  @IsString()
  abcIndic?: string;

  @ApiPropertyOptional({
    description: 'Priority level',
    example: '1',
    type: String,
    maxLength: 10
  })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({
    description: 'Equipment number',
    example: '000000000010000401',
    type: String,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  equipment?: string;

  @ApiPropertyOptional({
    description: 'Equipment description',
    example: 'MOTOR ELECTRICO 70 HP',
    type: String,
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  equiDescr?: string;

  @ApiPropertyOptional({
    description: 'Functional location',
    example: '1101-030-PT-01',
    type: String,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  funcLoc?: string;

  @ApiPropertyOptional({
    description: 'Functional location description',
    example: 'PLANTA 01',
    type: String,
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  funclDescr?: string;

  @ApiPropertyOptional({
    description: 'Assembly information',
    example: 'ASM001',
    type: String,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  assembly?: string;

  @ApiPropertyOptional({
    description: 'Planning plant',
    example: '3001',
    type: String,
    maxLength: 10
  })
  @IsOptional()
  @IsString()
  planPlant?: string;

  @ApiPropertyOptional({
    description: 'Responsible planner group',
    example: 'GROUP01',
    type: String,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  respPlannerGroup?: string;

  @ApiPropertyOptional({
    description: 'Main work center',
    example: 'MEC400',
    type: String,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  mnWkCtr?: string;

  @ApiPropertyOptional({
    description: 'System responsible',
    example: 'SYS01',
    type: String,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  systemResp?: string;

  @ApiPropertyOptional({
    description: 'Maintenance plan',
    example: '000000000256',
    type: String,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  maintPlan?: string;

  @ApiPropertyOptional({
    description: 'Work center',
    example: 'WC001',
    type: String,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  workCntr?: string;

  @ApiPropertyOptional({
    description: 'PM activity type',
    example: '002',
    type: String,
    maxLength: 10
  })
  @IsOptional()
  @IsString()
  pmactType?: string;

  @ApiPropertyOptional({
    description: 'Start point',
    example: 'SP001',
    type: String,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  startPoint?: string;

  @ApiPropertyOptional({
    description: 'End point',
    example: 'EP001',
    type: String,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  endPoint?: string;

  @ApiPropertyOptional({
    description: 'Linear length measurement',
    example: 100.5,
    type: Number
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  linearLength?: number;

  @ApiPropertyOptional({
    description: 'Linear unit of measurement',
    example: 'M',
    type: String,
    maxLength: 10
  })
  @IsOptional()
  @IsString()
  linearUnit?: string;
}
