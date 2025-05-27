import { PartialType } from '@nestjs/swagger';
import { CreateInspeccionDto } from './create-inspeccion.dto';

export class UpdateInspeccionDto extends PartialType(CreateInspeccionDto) {}
