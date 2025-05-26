import { PartialType } from '@nestjs/mapped-types';
import { CreateAvisosMantenimientoDto } from './create-avisos_mantenimiento.dto';

export class UpdateAvisosMantenimientoDto extends PartialType(CreateAvisosMantenimientoDto) {}
