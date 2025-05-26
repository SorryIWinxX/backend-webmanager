import { Injectable } from '@nestjs/common';
import { CreateOrdernesMantenimientoDto } from './dto/create-ordernes_mantenimiento.dto';
import { UpdateOrdernesMantenimientoDto } from './dto/update-ordernes_mantenimiento.dto';

@Injectable()
export class OrdernesMantenimientoService {
  create(createOrdernesMantenimientoDto: CreateOrdernesMantenimientoDto) {
    return 'This action adds a new ordernesMantenimiento';
  }

  findAll() {
    return `This action returns all ordernesMantenimiento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordernesMantenimiento`;
  }

  update(id: number, updateOrdernesMantenimientoDto: UpdateOrdernesMantenimientoDto) {
    return `This action updates a #${id} ordernesMantenimiento`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordernesMantenimiento`;
  }
}
