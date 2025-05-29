import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { SapService } from './sap.service';

@ApiTags('sap')
@Controller('sap')
export class SapController {
  constructor(private readonly sapService: SapService) {}

  @Post('enviar-aviso-mantenimiento')
  @ApiOperation({ 
    summary: 'Send maintenance notices to SAP',
    description: 'Sends multiple maintenance notices to the SAP system'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: {
            type: 'number'
          },
          description: 'Array of maintenance notice IDs to send to SAP'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Maintenance notices sent successfully to SAP' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid IDs or notices not found' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - SAP connection failed' 
  })
  enviarAvisoMantenimiento(@Body('ids') ids: number[]) {
    return this.sapService.enviarAvisoMantenimiento(ids);
  }

  @Get('sincronizar-tablas')
  @ApiOperation({ 
    summary: 'Synchronize all tables with SAP',
    description: 'Synchronizes all data tables (inspections, equipment, materials, and notification types) between the local database and SAP system in parallel'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'All tables synchronized successfully',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          description: 'Whether all synchronizations were successful'
        },
        message: {
          type: 'string',
          description: 'Overall synchronization status message'
        },
        data: {
          type: 'object',
          properties: {
            summary: {
              type: 'object',
              properties: {
                totalProcessedItems: { type: 'number' },
                totalCreatedCount: { type: 'number' },
                totalUpdatedCount: { type: 'number' },
                totalErrorCount: { type: 'number' }
              }
            },
            details: {
              type: 'object',
              properties: {
                inspecciones: { type: 'object' },
                equipos: { type: 'object' },
                materiales: { type: 'object' },
                tipoAvisos: { type: 'object' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - Synchronization failed' 
  })
  sincronizarTablas() {
    return this.sapService.sincronizarTablas();
  }

  @Get('sincronizar-equipos')
  @ApiOperation({ 
    summary: 'Synchronize equipment tables',
    description: 'Synchronizes equipment data between the local database and SAP system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Equipment tables synchronized successfully' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - Equipment synchronization failed' 
  })
  sincronizarEquipos() {
    return this.sapService.sincronizarEquipos();
  }

  @Get('sincronizar-materiales')
  @ApiOperation({ 
    summary: 'Synchronize materials tables',
    description: 'Synchronizes materials data between the local database and SAP system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Materials tables synchronized successfully' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - Materials synchronization failed' 
  })
  sincronizarMateriales() {
    return this.sapService.sincronizarMateriales();
  }

  @Get('sincronizar-tipo-avisos')
  @ApiOperation({ 
    summary: 'Synchronize notification types tables',
    description: 'Synchronizes notification types data between the local database and SAP system'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Notification types tables synchronized successfully' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - Notification types synchronization failed' 
  })
  sincronizarTipoAvisos() {
    return this.sapService.sincronizarTipoAvisos();
  }

}
