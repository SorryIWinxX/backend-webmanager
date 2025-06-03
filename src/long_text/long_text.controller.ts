import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LongTextService } from './long_text.service';
import { CreateLongTextDto } from './dto/create-long_text.dto';
import { UpdateLongTextDto } from './dto/update-long_text.dto';

@ApiTags('long-text')
@Controller('long-text')
export class LongTextController {
  constructor(private readonly longTextService: LongTextService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo texto largo' })
  @ApiResponse({ status: 201, description: 'Texto largo creado exitosamente.' })
  create(@Body() createLongTextDto: CreateLongTextDto) {
    return this.longTextService.create(createLongTextDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los textos largos' })
  @ApiResponse({ status: 200, description: 'Lista de textos largos.' })
  findAll() {
    return this.longTextService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un texto largo por ID' })
  @ApiResponse({ status: 200, description: 'Texto largo encontrado.' })
  @ApiResponse({ status: 404, description: 'Texto largo no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.longTextService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un texto largo' })
  @ApiResponse({ status: 200, description: 'Texto largo actualizado exitosamente.' })
  update(@Param('id') id: string, @Body() updateLongTextDto: UpdateLongTextDto) {
    return this.longTextService.update(+id, updateLongTextDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un texto largo' })
  @ApiResponse({ status: 200, description: 'Texto largo eliminado exitosamente.' })
  remove(@Param('id') id: string) {
    return this.longTextService.remove(+id);
  }
}
