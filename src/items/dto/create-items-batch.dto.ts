import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateItemDto } from './create-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemsBatchDto {
  @ApiProperty({
    description: 'Array de items para crear en batch',
    type: [CreateItemDto],
    example: [
      {
        "id": 1,
        "CONSE": "1"
      },
      {
        "id": 1,
        "SUBCO": "00001",
        "longTexts": {
          "linea": "line1",
          "textLine": "Esta es la línea 1"
        },
        "inspecciones": {
          "codigoGrupo": "AIREACA",
          "catalogo": "B",
          "codigo": "0010",
          "descripcion": "VENTILADOR"
        }
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items: CreateItemDto[];
} 