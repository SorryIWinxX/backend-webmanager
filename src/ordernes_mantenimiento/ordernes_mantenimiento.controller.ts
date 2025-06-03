import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OrdernesMantenimientoService } from './ordernes_mantenimiento.service';
import { CreateOrdernesMantenimientoDto } from './dto/create-ordernes_mantenimiento.dto';
import { OrdernesMantenimiento } from './entities/ordernes_mantenimiento.entity';

@ApiTags('ordenes_mantenimiento')
@Controller('ordernes-mantenimiento')
export class OrdernesMantenimientoController {
  constructor(private readonly ordernesMantenimientoService: OrdernesMantenimientoService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new maintenance order',
    description: 'Creates a new maintenance order in the system from SAP data'
  })
  @ApiBody({ 
    type: CreateOrdernesMantenimientoDto,
    description: 'Maintenance order data to create'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Maintenance order created successfully',
    type: OrdernesMantenimiento
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data provided' 
  })
  async create(@Body() createOrdernesMantenimientoDto: CreateOrdernesMantenimientoDto): Promise<OrdernesMantenimiento> {
    return await this.ordernesMantenimientoService.create(createOrdernesMantenimientoDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all maintenance orders',
    description: 'Retrieves a list of all maintenance orders in the system ordered by creation date'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of maintenance orders retrieved successfully',
    type: [OrdernesMantenimiento]
  })
  async findAll(): Promise<OrdernesMantenimiento[]> {
    return await this.ordernesMantenimientoService.findAll();
  }
}
