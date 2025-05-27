import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
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
