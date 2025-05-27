import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';

@ApiTags('material')
@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new material',
    description: 'Creates a new material in the system'
  })
  @ApiBody({ 
    type: CreateMaterialDto,
    description: 'Material data to create'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Material created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialService.create(createMaterialDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all materials',
    description: 'Retrieves a list of all materials in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of materials retrieved successfully' 
  })
  findAll() {
    return this.materialService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a material by ID',
    description: 'Retrieves a specific material by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string', 
    description: 'ID of the material to retrieve' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Material retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Material not found' 
  })
  findOne(@Param('id') id: string) {
    return this.materialService.findOne(+id);
  }

}
