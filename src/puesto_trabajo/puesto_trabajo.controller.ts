import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PuestoTrabajoService } from './puesto_trabajo.service';
import { CreatePuestoTrabajoDto } from './dto/create-puesto_trabajo.dto';

@ApiTags('puesto_trabajo')
@Controller('puesto-trabajo')
export class PuestoTrabajoController {
  constructor(private readonly puestoTrabajoService: PuestoTrabajoService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new work position',
    description: 'Creates a new work position in the system'
  })
  @ApiBody({ 
    type: CreatePuestoTrabajoDto,
    description: 'Work position data to create'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Work position created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  create(@Body() createPuestoTrabajoDto: CreatePuestoTrabajoDto) {
    return this.puestoTrabajoService.create(createPuestoTrabajoDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all work positions',
    description: 'Retrieves a list of all work positions in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of work positions retrieved successfully' 
  })
  findAll() {
    return this.puestoTrabajoService.findAll();
  }

}
