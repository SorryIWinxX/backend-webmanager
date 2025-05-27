import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SensorService } from './sensor.service';
import { CreateSensorDto } from './dto/create-sensor.dto';

@ApiTags('sensor')
@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new sensor',
    description: 'Creates a new sensor in the system'
  })
  @ApiBody({ 
    type: CreateSensorDto,
    description: 'Sensor data to create'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Sensor created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  create(@Body() createSensorDto: CreateSensorDto) {
    return this.sensorService.create(createSensorDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all sensors',
    description: 'Retrieves a list of all sensors in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of sensors retrieved successfully' 
  })
  findAll() {
    return this.sensorService.findAll();
  }

}
