import { Controller, Get, Post, Param, ParseIntPipe, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { SapService } from './sap.service';

@ApiTags('sap')
@Controller('sap')
export class SapController {
  constructor(private readonly sapService: SapService) {}

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

  @Post('enviar-aviso/:id')
  @ApiOperation({ 
    summary: 'Send maintenance notice to SAP',
    description: 'Sends a maintenance notice to SAP system and updates the local status'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID of the maintenance notice to send'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Maintenance notice sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          description: 'Whether the notice was sent successfully'
        },
        message: {
          type: 'string',
          description: 'Status message'
        },
        data: {
          type: 'object',
          properties: {
            avisoId: { type: 'number' },
            sapResponse: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Missing required data in maintenance notice' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Maintenance notice not found' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - Failed to send notice to SAP' 
  })
  enviarAvisoMantenimiento(@Param('id', ParseIntPipe) id: number) {
    return this.sapService.enviarAvisoMantenimiento(id);
  }

  @Post('enviar-avisos')
  @ApiOperation({ 
    summary: 'Send multiple maintenance notices to SAP',
    description: 'Sends multiple maintenance notices to SAP system and updates their local status'
  })
  @ApiBody({
    description: 'Array of maintenance notice IDs to send',
    schema: {
      type: 'object',
      properties: {
        avisosIds: {
          type: 'array',
          items: {
            type: 'number'
          },
          description: 'Array of maintenance notice IDs',
          example: [1, 2, 3, 4, 5]
        }
      },
      required: ['avisosIds']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Maintenance notices processed successfully',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          description: 'Whether all notices were sent successfully'
        },
        message: {
          type: 'string',
          description: 'Summary message'
        },
        data: {
          type: 'object',
          properties: {
            totalProcessed: { type: 'number' },
            successCount: { type: 'number' },
            errorCount: { type: 'number' },
            results: { 
              type: 'array',
              items: { type: 'object' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid array of IDs' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - Failed to process notices' 
  })
  enviarAvisosMantenimiento(@Body() body: { avisosIds: number[] }) {
    return this.sapService.enviarAvisosMantenimiento(body.avisosIds);
  }

}