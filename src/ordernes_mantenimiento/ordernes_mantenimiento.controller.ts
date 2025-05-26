import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdernesMantenimientoService } from './ordernes_mantenimiento.service';
import { CreateOrdernesMantenimientoDto } from './dto/create-ordernes_mantenimiento.dto';
import { UpdateOrdernesMantenimientoDto } from './dto/update-ordernes_mantenimiento.dto';

@Controller('ordernes-mantenimiento')
export class OrdernesMantenimientoController {
  constructor(private readonly ordernesMantenimientoService: OrdernesMantenimientoService) {}

  @Post()
  create(@Body() createOrdernesMantenimientoDto: CreateOrdernesMantenimientoDto) {
    return this.ordernesMantenimientoService.create(createOrdernesMantenimientoDto);
  }

  @Get()
  findAll() {
    return this.ordernesMantenimientoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordernesMantenimientoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdernesMantenimientoDto: UpdateOrdernesMantenimientoDto) {
    return this.ordernesMantenimientoService.update(+id, updateOrdernesMantenimientoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordernesMantenimientoService.remove(+id);
  }
}
