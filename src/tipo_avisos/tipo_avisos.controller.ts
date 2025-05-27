import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { TipoAvisosService } from './tipo_avisos.service';
import { CreateTipoAvisoDto } from './dto/create-tipo_aviso.dto';
import { UpdateTipoAvisoDto } from './dto/update-tipo_aviso.dto';

@ApiTags('tipo_avisos')
@Controller('tipo-avisos')
export class TipoAvisosController {
  constructor(private readonly tipoAvisosService: TipoAvisosService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new notice type',
    description: 'Creates a new notice type in the system'
  })
  @ApiBody({ 
    type: CreateTipoAvisoDto,
    description: 'Notice type data to create'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Notice type created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  create(@Body() createTipoAvisoDto: CreateTipoAvisoDto) {
    return this.tipoAvisosService.create(createTipoAvisoDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all notice types',
    description: 'Retrieves a list of all notice types in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of notice types retrieved successfully' 
  })
  findAll() {
    return this.tipoAvisosService.findAll();
  }

}
