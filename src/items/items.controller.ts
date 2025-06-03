import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateItemsBatchDto } from './dto/create-items-batch.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un item individual' })
  @ApiResponse({ status: 201, description: 'Item creado exitosamente' })
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Crear múltiples items en batch' })
  @ApiResponse({ status: 201, description: 'Items creados exitosamente' })
  createBatch(@Body() createItemsBatchDto: CreateItemsBatchDto) {
    return this.itemsService.createBatch(createItemsBatchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los items' })
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un item por ID' })
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un item' })
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un item' })
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
