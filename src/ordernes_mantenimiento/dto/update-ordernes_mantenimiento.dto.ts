import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdernesMantenimientoDto } from './create-ordernes_mantenimiento.dto';

export class UpdateOrdernesMantenimientoDto extends PartialType(CreateOrdernesMantenimientoDto) {}
