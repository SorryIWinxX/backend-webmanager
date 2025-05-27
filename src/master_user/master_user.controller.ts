import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { MasterUserService } from './master_user.service';
import { CreateMasterUserDto } from './dto/create-master_user.dto';
import { LoginMasterUserDto } from './dto/login-master_user.dto';

@ApiTags('master_user')
@Controller('master-user')
export class MasterUserController {
  constructor(private readonly masterUserService: MasterUserService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new master user',
    description: 'Creates a new master user account in the system'
  })
 
  @ApiResponse({ 
    status: 201, 
    description: 'Master user created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict - User already exists' 
  })
  create(@Body() createMasterUserDto: CreateMasterUserDto) {
    return this.masterUserService.create(createMasterUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ 
    summary: 'Master user login',
    description: 'Authenticates a master user and returns access credentials'
  })
  @ApiBody({ 
    type: LoginMasterUserDto,
    description: 'Login credentials'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful - User authenticated' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Invalid credentials' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Missing credentials' 
  })
  login(@Body() loginMasterUserDto: LoginMasterUserDto) {
    return this.masterUserService.login(loginMasterUserDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all master users',
    description: 'Retrieves a list of all master users in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of master users retrieved successfully' 
  })
  findAll() {
    return this.masterUserService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a master user by ID',
    description: 'Retrieves a specific master user by their ID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'ID of the master user to retrieve' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Master user retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Master user not found' 
  })
  findOne(@Param('id') id: number) {
    return this.masterUserService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a master user',
    description: 'Removes a master user from the system'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'ID of the master user to delete' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Master user deleted successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Master user not found' 
  })
  remove(@Param('id') id: number) {
    return this.masterUserService.remove(+id);
  }
}
