import { PartialType } from '@nestjs/mapped-types';
import { CreateUbicacionTecnicaDto } from './create-ubicacion_tecnica.dto';

export class UpdateUbicacionTecnicaDto extends PartialType(CreateUbicacionTecnicaDto) {}
