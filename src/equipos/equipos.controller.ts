import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EquiposService } from './equipos.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';

@ApiTags('equipos')
@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new equipment',
    description: 'Creates a new equipment record in the system'
  })
  @ApiBody({ 
    type: CreateEquipoDto,
    description: 'Equipment data to create'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Equipment created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  create(@Body() createEquipoDto: CreateEquipoDto) {
    return this.equiposService.create(createEquipoDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all equipment',
    description: 'Retrieves a list of all equipment in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of equipment retrieved successfully' 
  })
  findAll() {
    return this.equiposService.findAll();
  }

}
