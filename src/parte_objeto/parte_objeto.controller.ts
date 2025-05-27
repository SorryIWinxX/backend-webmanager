import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ParteObjetoService } from './parte_objeto.service';
import { CreateParteObjetoDto } from './dto/create-parte_objeto.dto';

@ApiTags('parte_objeto')
@Controller('parte-objeto')
export class ParteObjetoController {
  constructor(private readonly parteObjetoService: ParteObjetoService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new object part',
    description: 'Creates a new object part in the system'
  })
  @ApiBody({ 
    type: CreateParteObjetoDto,
    description: 'Object part data to create'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Object part created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  create(@Body() createParteObjetoDto: CreateParteObjetoDto) {
    return this.parteObjetoService.create(createParteObjetoDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all object parts',
    description: 'Retrieves a list of all object parts in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of object parts retrieved successfully' 
  })
  findAll() {
    return this.parteObjetoService.findAll();
  }

}
