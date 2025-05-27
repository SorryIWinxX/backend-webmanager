import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AvisosMantenimientoService } from './avisos_mantenimiento.service';
import { CreateAvisosMantenimientoDto } from './dto/create-avisos_mantenimiento.dto';

@ApiTags('avisos_mantenimiento')
@Controller('avisos-mantenimiento')
export class AvisosMantenimientoController {
  constructor(private readonly avisosMantenimientoService: AvisosMantenimientoService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new maintenance notice',
    description: 'Creates a new maintenance notice in the system'
  })
  @ApiBody({ 
    type: CreateAvisosMantenimientoDto,
    description: 'Maintenance notice data to create'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Maintenance notice created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  create(@Body() createAvisosMantenimientoDto: CreateAvisosMantenimientoDto) {
    return this.avisosMantenimientoService.create(createAvisosMantenimientoDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all maintenance notices',
    description: 'Retrieves a list of all maintenance notices in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of maintenance notices retrieved successfully' 
  })
  findAll() {
    return this.avisosMantenimientoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a maintenance notice by ID',
    description: 'Retrieves a specific maintenance notice by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'ID of the maintenance notice to retrieve' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Maintenance notice retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Maintenance notice not found' 
  })
  findOne(@Param('id') id: number) {
    return this.avisosMantenimientoService.findOne(+id);
  }

}
