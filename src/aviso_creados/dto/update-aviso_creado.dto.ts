import { PartialType } from '@nestjs/swagger';
import { CreateAvisoCreadoDto } from './create-aviso_creado.dto';

export class UpdateAvisoCreadoDto extends PartialType(CreateAvisoCreadoDto) {}
