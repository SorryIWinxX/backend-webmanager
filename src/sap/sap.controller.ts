import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SapService } from './sap.service';

@ApiTags('sap')
@Controller('sap')
export class SapController {
  constructor(private readonly sapService: SapService) {}

  @Post('enviar-aviso-mantenimiento/:id')
  @ApiOperation({ 
    summary: 'Send maintenance notice to SAP',
    description: 'Sends a maintenance notice with the specified ID to the SAP system'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number', 
    description: 'ID of the maintenance notice to send to SAP' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Maintenance notice sent successfully to SAP' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid ID or notice not found' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - SAP connection failed' 
  })
  enviarAvisoMantenimiento(@Param('id') id: number) {
    return this.sapService.enviarAvisoMantenimiento(id);
  }

  @Get('sincronizar-tablas')
  @ApiOperation({ 
    summary: 'Synchronize maintenance notices tables',
    description: 'Synchronizes maintenance notices data between the local database and SAP system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tables synchronized successfully' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - Synchronization failed' 
  })
  sincronizarAvisosMantenimiento() {
    return this.sapService.sincronizarAvisosMantenimiento();
  }

}
