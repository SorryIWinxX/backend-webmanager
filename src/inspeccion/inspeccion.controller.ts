import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { InspeccionService } from './inspeccion.service';
import { CreateInspeccionDto } from './dto/create-inspeccion.dto';

@ApiTags('inspeccion')
@Controller('inspeccion')
export class InspeccionController {
  constructor(private readonly inspeccionService: InspeccionService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new inspection',
    description: 'Creates a new inspection record in the system'
  })
  @ApiBody({ 
    type: CreateInspeccionDto,
    description: 'Inspection data to create'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Inspection created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  create(@Body() createInspeccionDto: CreateInspeccionDto) {
    return this.inspeccionService.create(createInspeccionDto);
  }

  @Get('search/:codigoGrupo')
  @ApiOperation({ 
    summary: 'Search inspections by code group and catalog',
    description: 'Hierarchical search for inspections. If catalog is provided, returns specific category. Otherwise returns full hierarchy.'
  })
  @ApiParam({ 
    name: 'codigoGrupo', 
    type: 'string', 
    description: 'Code group to search for (e.g., HERR01)' 
  })
  @ApiQuery({ 
    name: 'catalogo', 
    type: 'string', 
    description: 'Optional catalog filter (e.g., B, C, 5)',
    required: false 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Search results retrieved successfully' 
  })
  searchInspecciones(
    @Param('codigoGrupo') codigoGrupo: string,
    @Query('catalogo') catalogo?: string
  ) {
    return this.inspeccionService.searchInspecciones(codigoGrupo, catalogo);
  }

  @Get('hierarchy/:codigoGrupo')
  @ApiOperation({ 
    summary: 'Get complete hierarchy for a code group',
    description: 'Returns the complete hierarchical structure of inspections for a given code group'
  })
  @ApiParam({ 
    name: 'codigoGrupo', 
    type: 'string', 
    description: 'Code group to get hierarchy for (e.g., HERR01)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Hierarchy retrieved successfully' 
  })
  getHierarchy(@Param('codigoGrupo') codigoGrupo: string) {
    return this.inspeccionService.findHierarchyByCodigoGrupo(codigoGrupo);
  }

  @Get('by-catalog/:codigoGrupo/:catalogo')
  @ApiOperation({ 
    summary: 'Get inspections by code group and catalog',
    description: 'Returns all inspections for a specific code group and catalog combination'
  })
  @ApiParam({ 
    name: 'codigoGrupo', 
    type: 'string', 
    description: 'Code group to search for (e.g., HERR01)' 
  })
  @ApiParam({ 
    name: 'catalogo', 
    type: 'string', 
    description: 'Catalog to search for (e.g., B, C, 5)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Inspections retrieved successfully' 
  })
  findByCatalog(
    @Param('codigoGrupo') codigoGrupo: string,
    @Param('catalogo') catalogo: string
  ) {
    return this.inspeccionService.findByCodigoGrupoAndCatalogo(codigoGrupo, catalogo);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all inspections',
    description: 'Retrieves a list of all inspections in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of inspections retrieved successfully' 
  })
  findAll() {
    return this.inspeccionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get an inspection by ID',
    description: 'Retrieves a specific inspection by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string', 
    description: 'ID of the inspection to retrieve' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Inspection retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Inspection not found' 
  })
  findOne(@Param('id') id: string) {
    return this.inspeccionService.findOne(+id);
  }

}
