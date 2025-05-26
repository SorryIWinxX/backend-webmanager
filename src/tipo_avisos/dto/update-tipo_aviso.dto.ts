import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoAvisoDto } from './create-tipo_aviso.dto';

export class UpdateTipoAvisoDto extends PartialType(CreateTipoAvisoDto) {}
