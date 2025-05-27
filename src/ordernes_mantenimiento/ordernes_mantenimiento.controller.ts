import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrdernesMantenimientoService } from './ordernes_mantenimiento.service';
import { CreateOrdernesMantenimientoDto } from './dto/create-ordernes_mantenimiento.dto';
import { UpdateOrdernesMantenimientoDto } from './dto/update-ordernes_mantenimiento.dto';

@ApiTags('ordenes_mantenimiento')
@Controller('ordernes-mantenimiento')
export class OrdernesMantenimientoController {
  constructor(private readonly ordernesMantenimientoService: OrdernesMantenimientoService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new maintenance order',
    description: 'Creates a new maintenance order in the system'
  })
  @ApiBody({ 
    type: CreateOrdernesMantenimientoDto,
    description: 'Maintenance order data to create'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Maintenance order created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  create(@Body() createOrdernesMantenimientoDto: CreateOrdernesMantenimientoDto) {
    return this.ordernesMantenimientoService.create(createOrdernesMantenimientoDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all maintenance orders',
    description: 'Retrieves a list of all maintenance orders in the system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of maintenance orders retrieved successfully' 
  })
  findAll() {
    return this.ordernesMantenimientoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a maintenance order by ID',
    description: 'Retrieves a specific maintenance order by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string', 
    description: 'ID of the maintenance order to retrieve' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Maintenance order retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Maintenance order not found' 
  })
  findOne(@Param('id') id: string) {
    return this.ordernesMantenimientoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update a maintenance order',
    description: 'Updates an existing maintenance order with new data'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string', 
    description: 'ID of the maintenance order to update' 
  })
  @ApiBody({ 
    type: UpdateOrdernesMantenimientoDto,
    description: 'Updated maintenance order data'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Maintenance order updated successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Maintenance order not found' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  update(@Param('id') id: string, @Body() updateOrdernesMantenimientoDto: UpdateOrdernesMantenimientoDto) {
    return this.ordernesMantenimientoService.update(+id, updateOrdernesMantenimientoDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a maintenance order',
    description: 'Removes a maintenance order from the system'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'string', 
    description: 'ID of the maintenance order to delete' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Maintenance order deleted successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Maintenance order not found' 
  })
  remove(@Param('id') id: string) {
    return this.ordernesMantenimientoService.remove(+id);
  }
}
