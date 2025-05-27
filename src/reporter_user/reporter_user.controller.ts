import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ReporterUserService } from './reporter_user.service';
import { CreateReporterUserDto } from './dto/create-reporter_user.dto';

@ApiTags('reporter_user')
@Controller('reporter-user')
export class ReporterUserController {
  constructor(private readonly reporterUserService: ReporterUserService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new reporter user',
    description: 'Creates a new reporter user account in the system'
  })
  @ApiBody({ 
    type: CreateReporterUserDto,
    description: 'Reporter user data to create'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Reporter user created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - User already exists' 
  })
  create(@Body() createReporterUserDto: CreateReporterUserDto) {
    return this.reporterUserService.create(createReporterUserDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all reporter users',
    description: 'Retrieves a list of all reporter users in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of reporter users retrieved successfully' 
  })
  findAll() {
    return this.reporterUserService.findAll();
  }

  @Get(':id/avisos-mantenimiento')
  @ApiOperation({ 
    summary: 'Get maintenance notices by reporter user',
    description: 'Retrieves all maintenance notices created by a specific reporter user'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string', 
    description: 'ID of the reporter user' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Maintenance notices retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Reporter user not found' 
  })
  findAvisosMantenimiento(@Param('id') id: string) {
    return this.reporterUserService.findAvisosMantenimiento(+id);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a reporter user',
    description: 'Removes a reporter user from the system'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string', 
    description: 'ID of the reporter user to delete' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Reporter user deleted successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Reporter user not found' 
  })
  remove(@Param('id') id: string) {
    return this.reporterUserService.remove(+id);
  }
}
