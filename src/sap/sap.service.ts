import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AvisosMantenimientoService } from 'src/avisos_mantenimiento/avisos_mantenimiento.service';
import { InspeccionService } from 'src/inspeccion/inspeccion.service';
import { EquiposService } from 'src/equipos/equipos.service';
import { MaterialService } from 'src/material/material.service';
import { TipoAvisosService } from 'src/tipo_avisos/tipo_avisos.service';
import axios from 'axios';
import * as xml2js from 'xml2js';

const CHUNK_SIZE = 100; // Define chunk size for processing

@Injectable()
export class SapService {
  private readonly sapUrl = 'http://smadev.laboratoriossmart.com:8000/sap/bc/srt/rfc/sap/zws_crear_aviso/300/zws_crear_aviso/zws_crear_aviso';

  constructor(
    private readonly avisosMantenimientoService: AvisosMantenimientoService,
    private readonly inspeccionService: InspeccionService,
    private readonly equiposService: EquiposService,
    private readonly materialService: MaterialService,
    private readonly tipoAvisosService: TipoAvisosService,
  ) {}

  async enviarAvisoMantenimiento(ids: number[]) {
    try {
      // Process all IDs in parallel
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            // Obtener el aviso de mantenimiento con todas sus relaciones
            const aviso = await this.avisosMantenimientoService.findOne(id);
            
            if (!aviso) {
              return {
                id,
                success: false,
                message: 'Aviso de mantenimiento no encontrado'
              };
            }

            // Formatear fechas y horas para SAP
            const fechaInicioFormatted = this.formatDate(aviso.fechaInicio);
            const fechaFinFormatted = aviso.fechaFin ? this.formatDate(aviso.fechaFin) : fechaInicioFormatted;
            const horaInicioFormatted = this.formatTime(aviso.horaInicio);
            const horaFinFormatted = aviso.horaFin ? this.formatTime(aviso.horaFin) : horaInicioFormatted;

            // Crear el XML SOAP con los datos disponibles
            const soapBody = this.createSoapXml(aviso, fechaInicioFormatted, fechaFinFormatted, horaInicioFormatted, horaFinFormatted);

            // Configurar headers para la petición SOAP
            const headers = {
              'Content-Type': 'text/xml; charset=utf-8',
              'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZIMMF_CREAR_AVISO',
            };

            // Mockup response para simular éxito
            const mockupResponse = {
              status: 200,
              data: {
                ZIMMF_CREAR_AVISO: {
                  E_NOTIF_NUMBER: `NOTIF${id.toString().padStart(8, '0')}`,
                  E_RETURN: {
                    TYPE: 'S',
                    MESSAGE: 'Aviso creado exitosamente en SAP'
                  }
                }
              }
            };

            // Enviar petición a SAP (comentado para usar mockup)
            // const response = await axios.post(this.sapUrl, soapBody, { headers });
            const response = mockupResponse;

            // Actualizar estado del aviso según la respuesta
            if (response.status === 200) {
              // Actualizar el estado del aviso a 'enviado'
              await this.avisosMantenimientoService.update(id, {
                estado: 'enviado',
                numeroSap: response.data.ZIMMF_CREAR_AVISO.E_NOTIF_NUMBER
              });

              return {
                id,
                success: true,
                message: 'Aviso enviado exitosamente a SAP',
                numeroSap: response.data.ZIMMF_CREAR_AVISO.E_NOTIF_NUMBER,
                data: response.data
              };
            }

            return {
              id,
              success: false,
              message: 'Error al enviar aviso a SAP',
              data: response.data
            };

          } catch (error) {
            // Actualizar estado del aviso a 'fallido'
            await this.avisosMantenimientoService.update(id, {
              estado: 'fallido'
            });
            
            return {
              id,
              success: false,
              message: `Error al enviar aviso a SAP: ${error.message}`
            };
          }
        })
      );

      return {
        success: true,
        message: 'Proceso de envío completado',
        results
      };

    } catch (error) {
      throw new HttpException(
        `Error al procesar los avisos: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private createSoapXml(aviso: any, fechaInicio: string, fechaFin: string, horaInicio: string, horaFin: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZIMMF_CREAR_AVISO>
         <I_NOTHEAD>
            ${aviso.numeroExt ? `<EXTERNAL_NUMBER>${aviso.numeroExt}</EXTERNAL_NUMBER>` : '<EXTERNAL_NUMBER></EXTERNAL_NUMBER>'}
            <NOTIF_TYPE>${aviso.tipoAviso?.codigo || 'M1'}</NOTIF_TYPE>
            ${aviso.equipo?.codigo ? `<EQUIPMENT>${aviso.equipo.codigo}</EQUIPMENT>` : ''}
            ${aviso.ubicacionTecnica?.codigo ? `<FUNCT_LOC>${aviso.ubicacionTecnica.codigo}</FUNCT_LOC>` : ''}
            ${aviso.parteObjeto?.codigo ? `<ASSEMBLY>${aviso.parteObjeto.codigo}</ASSEMBLY>` : ''}
            <SHORT_TEXT>${aviso.textoBreve}</SHORT_TEXT>
            <DESSTDATE>${fechaInicio}</DESSTDATE>
            <DESSTTIME>${horaInicio}</DESSTTIME>
            <DESENDDATE>${fechaFin}</DESENDDATE>
            <DESENDTM>${horaFin}</DESENDTM>
            ${aviso.masterUser?.codigo ? `<PM_WKCTR>${aviso.masterUser.codigo}</PM_WKCTR>` : ''}
            ${aviso.reporterUser?.codigo ? `<REPORTEDBY>${aviso.reporterUser.codigo.substring(0, 12)}</REPORTEDBY>` : ''}
         </I_NOTHEAD>
         <TI_LONGTEX>
            <item>
               <CONSE>0000000001</CONSE>
               <SUBCO>00001</SUBCO>
               <LINEA>00001</LINEA>
               <TEXT_LINE>${aviso.textoBreve}</TEXT_LINE>
            </item>
         </TI_LONGTEX>
         
         <TI_NOTITEM>
            <item>
               <CONSE>0000000001</CONSE>
               <SUBCO>00001</SUBCO>
               <ITEM_KEY>0001</ITEM_KEY>
               <ITEM_SORT_NO>0001</ITEM_SORT_NO>
               <DESCRIPT>${aviso.textoBreve}</DESCRIPT>
            </item>
         </TI_NOTITEM>
      </urn:ZIMMF_CREAR_AVISO>
   </soapenv:Body>
</soapenv:Envelope>`;
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatTime(time: string): string {
    if (!time) return '00:00:00';
    // Si el tiempo ya está en formato HH:MM:SS, devolverlo tal como está
    if (time.match(/^\d{2}:\d{2}:\d{2}$/)) {
      return time;
    }
    // Si está en formato HH:MM, agregar :00
    if (time.match(/^\d{2}:\d{2}$/)) {
      return `${time}:00`;
    }
    return `${time}:00:00`;
  }

  async sincronizarTablas() {
    try {
      // Execute all synchronizations in parallel
      const [
        inspeccionesResult,
        equiposResult,
        materialesResult,
        tipoAvisosResult
      ] = await Promise.allSettled([
        this.sincronizarInspecciones(),
        this.sincronizarEquipos(),
        this.sincronizarMateriales(),
        this.sincronizarTipoAvisos()
      ]);

      // Process results and handle any failures
      const results = {
        inspecciones: this.processSettledResult(inspeccionesResult, 'Inspecciones'),
        equipos: this.processSettledResult(equiposResult, 'Equipos'),
        materiales: this.processSettledResult(materialesResult, 'Materiales'),
        tipoAvisos: this.processSettledResult(tipoAvisosResult, 'Tipo Avisos')
      };

      // Calculate totals
      const totalProcessedItems = Object.values(results).reduce((sum, result) => 
        sum + (result.success ? result.data.processedItems : 0), 0
      );
      const totalCreatedCount = Object.values(results).reduce((sum, result) => 
        sum + (result.success ? result.data.createdCount : 0), 0
      );
      const totalUpdatedCount = Object.values(results).reduce((sum, result) => 
        sum + (result.success ? result.data.updatedCount : 0), 0
      );
      const totalErrorCount = Object.values(results).reduce((sum, result) => 
        sum + (result.success ? result.data.errorCount : 0), 0
      );

      // Check if all synchronizations were successful
      const allSuccessful = Object.values(results).every(result => result.success);

      return {
        success: allSuccessful,
        message: allSuccessful 
          ? 'Sincronización completa con SAP completada exitosamente'
          : 'Sincronización con SAP completada con algunos errores',
        data: {
          summary: {
            totalProcessedItems,
            totalCreatedCount,
            totalUpdatedCount,
            totalErrorCount
          },
          details: results
        }
      };
      
    } catch (error) {
      throw new HttpException(
        `Error al sincronizar tablas con SAP: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private processSettledResult(result: PromiseSettledResult<any>, tableName: string) {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        success: false,
        message: `Error en sincronización de ${tableName}: ${result.reason?.message || 'Error desconocido'}`,
        data: {
          processedItems: 0,
          createdCount: 0,
          updatedCount: 0,
          errorCount: 0
        }
      };
    }
  }

  private async sincronizarInspecciones() {
    try {
      const response = await this.getTableInspeccion();
      
      if (response.success && response.data) {
        // Parse the XML response
        const parser = new xml2js.Parser({ explicitArray: false });
        const parsedData = await parser.parseStringPromise(response.data);
        
        // Extract TI_CLAINS data from the parsed XML
        const soapBody = parsedData['soap-env:Envelope']['soap-env:Body'];
        const zimmfResponse = soapBody['n0:ZIMMF_TABLASResponse'];
        const tiClains = zimmfResponse['TI_CLAINS'];
        
        let inspeccionesData = [];
        if (tiClains && tiClains.item) {
          // Handle both single item and array of items
          inspeccionesData = Array.isArray(tiClains.item) ? tiClains.item : [tiClains.item];
        }
        
        // Process inspections in chunks
        let totalProcessedItems = 0;
        let totalCreatedCount = 0;
        let totalUpdatedCount = 0;
        let totalErrorCount = 0;

        for (let i = 0; i < inspeccionesData.length; i += CHUNK_SIZE) {
          const chunk = inspeccionesData.slice(i, i + CHUNK_SIZE);
          const upsertResult = await this.inspeccionService.upsertInspecciones(chunk);
          totalCreatedCount += upsertResult.createdCount;
          totalUpdatedCount += upsertResult.updatedCount;
          totalErrorCount += upsertResult.errorCount;
          totalProcessedItems += chunk.length;
        }
        
        return {
          success: true,
          message: 'Sincronización de inspecciones con SAP completada exitosamente',
          data: {
            processedItems: totalProcessedItems,
            createdCount: totalCreatedCount,
            updatedCount: totalUpdatedCount,
            errorCount: totalErrorCount
          }
        };
      }
      
      return {
        success: false,
        message: 'Error en la sincronización de inspecciones con SAP',
        data: {
          processedItems: 0,
          createdCount: 0,
          updatedCount: 0,
          errorCount: 0
        }
      };
      
    } catch (error) {
      throw new HttpException(
        `Error al sincronizar inspecciones con SAP: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async getTableInspeccion() {
    try {
      const sapSyncUrl = 'http://smadev.laboratoriossmart.com:8000/sap/bc/srt/rfc/sap/zws_tablas/300/zws_tablas/zws_tablas';
      
      const soapBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZIMMF_TABLAS>
         <I_OPCION>INSP</I_OPCION>
         <!--Optional:-->
         <TI_CLAINS>
            <!--Zero or more repetitions:-->
            <item>
               <KATALOGART></KATALOGART>
               <CODEGRUPPE></CODEGRUPPE>
               <CODE></CODE>
               <KURZTEXT></KURZTEXT>
               <KATALOGART2></KATALOGART2>
            </item>
         </TI_CLAINS>
         <!--Optional:-->
         <TI_EQUIPOS>
            <!--Zero or more repetitions:-->
            <item>
               <EQUNR></EQUNR>
               <TPLNR></TPLNR>
               <GEWRK></GEWRK>
               <RBNR></RBNR>
               <EQKTX></EQKTX>
            </item>
         </TI_EQUIPOS>
         <!--Optional:-->
         <TI_MARA>
            <!--Zero or more repetitions:-->
            <item>
               <BAUTL></BAUTL>
               <MAKTG></MAKTG>
            </item>
         </TI_MARA>
         <!--Optional:-->
         <TI_TQ80>
            <!--Zero or more repetitions:-->
            <item>
               <QMART></QMART>
               <QMARTX></QMARTX>
            </item>
         </TI_TQ80>
      </urn:ZIMMF_TABLAS>
   </soapenv:Body>
</soapenv:Envelope>`;

      // Configurar headers para la petición SOAP
      const headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZIMMF_TABLAS',
      };

      // Realizar la petición POST a SAP
      const response = await axios.post(sapSyncUrl, soapBody, { headers });

      if (response.status === 200) {
        return {
          success: true,
          message: 'Sincronización con SAP completada exitosamente',
          data: response.data
        };
      }

      return {
        success: false,
        message: 'Error en la sincronización con SAP',
        data: response.data
      };

    } catch (error) {
      throw new HttpException(
        `Error al sincronizar con SAP: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async getTableEquipos() {
    try {
      const sapSyncUrl = 'http://smadev.laboratoriossmart.com:8000/sap/bc/srt/rfc/sap/zws_tablas/300/zws_tablas/zws_tablas';
      
      const soapBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZIMMF_TABLAS>
         <I_OPCION>EQUI</I_OPCION>
         <!--Optional:-->
         <TI_CLAINS>
            <!--Zero or more repetitions:-->
            <item>
               <KATALOGART></KATALOGART>
               <CODEGRUPPE></CODEGRUPPE>
               <CODE></CODE>
               <KURZTEXT></KURZTEXT>
               <KATALOGART2></KATALOGART2>
            </item>
         </TI_CLAINS>
         <!--Optional:-->
         <TI_EQUIPOS>
            <!--Zero or more repetitions:-->
            <item>
               <EQUNR></EQUNR>
               <TPLNR></TPLNR>
               <GEWRK></GEWRK>
               <RBNR></RBNR>
               <EQKTX></EQKTX>
            </item>
         </TI_EQUIPOS>
         <!--Optional:-->
         <TI_MARA>
            <!--Zero or more repetitions:-->
            <item>
               <BAUTL></BAUTL>
               <MAKTG></MAKTG>
            </item>
         </TI_MARA>
         <!--Optional:-->
         <TI_TQ80>
            <!--Zero or more repetitions:-->
            <item>
               <QMART></QMART>
               <QMARTX></QMARTX>
            </item>
         </TI_TQ80>
      </urn:ZIMMF_TABLAS>
   </soapenv:Body>
</soapenv:Envelope>`;

      // Configurar headers para la petición SOAP
      const headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZIMMF_TABLAS',
      };

      // Realizar la petición POST a SAP
      const response = await axios.post(sapSyncUrl, soapBody, { headers });

      if (response.status === 200) {
        return {
          success: true,
          message: 'Sincronización de equipos con SAP completada exitosamente',
          data: response.data
        };
      }

      return {
        success: false,
        message: 'Error en la sincronización de equipos con SAP',
        data: response.data
      };

    } catch (error) {
      throw new HttpException(
        `Error al sincronizar equipos con SAP: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async sincronizarEquipos() {
    try {
      const response = await this.getTableEquipos();
      
      if (response.success && response.data) {
        // Parse the XML response
        const parser = new xml2js.Parser({ explicitArray: false });
        const parsedData = await parser.parseStringPromise(response.data);
        
        // Extract TI_EQUIPOS data from the parsed XML
        const soapBody = parsedData['soap-env:Envelope']['soap-env:Body'];
        const zimmfResponse = soapBody['n0:ZIMMF_TABLASResponse'];
        const tiEquipos = zimmfResponse['TI_EQUIPOS'];
        
        let equiposData = [];
        if (tiEquipos && tiEquipos.item) {
          // Handle both single item and array of items
          equiposData = Array.isArray(tiEquipos.item) ? tiEquipos.item : [tiEquipos.item];
        }
        
        // Process equipos in chunks
        let totalProcessedItems = 0;
        let totalCreatedCount = 0;
        let totalUpdatedCount = 0;
        let totalErrorCount = 0;

        for (let i = 0; i < equiposData.length; i += CHUNK_SIZE) {
          const chunk = equiposData.slice(i, i + CHUNK_SIZE);
          const upsertResult = await this.equiposService.upsertEquipos(chunk);
          totalCreatedCount += upsertResult.createdCount;
          totalUpdatedCount += upsertResult.updatedCount;
          totalErrorCount += upsertResult.errorCount;
          totalProcessedItems += chunk.length;
        }
        
        return {
          success: true,
          message: 'Sincronización de equipos con SAP completada exitosamente',
          data: {
            processedItems: totalProcessedItems,
            createdCount: totalCreatedCount,
            updatedCount: totalUpdatedCount,
            errorCount: totalErrorCount
          }
        };
      }
      
      return {
        success: false,
        message: 'Error en la sincronización de equipos con SAP',
      };
      
    } catch (error) {
      throw new HttpException(
        `Error al sincronizar equipos con SAP: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async getTableMateriales() {
    try {
      const sapSyncUrl = 'http://smadev.laboratoriossmart.com:8000/sap/bc/srt/rfc/sap/zws_tablas/300/zws_tablas/zws_tablas';
      
      const soapBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZIMMF_TABLAS>
         <I_OPCION>MARA</I_OPCION>
         <!--Optional:-->
         <TI_CLAINS>
            <!--Zero or more repetitions:-->
            <item>
               <KATALOGART></KATALOGART>
               <CODEGRUPPE></CODEGRUPPE>
               <CODE></CODE>
               <KURZTEXT></KURZTEXT>
               <KATALOGART2></KATALOGART2>
            </item>
         </TI_CLAINS>
         <!--Optional:-->
         <TI_EQUIPOS>
            <!--Zero or more repetitions:-->
            <item>
               <EQUNR></EQUNR>
               <TPLNR></TPLNR>
               <GEWRK></GEWRK>
               <RBNR></RBNR>
               <EQKTX></EQKTX>
            </item>
         </TI_EQUIPOS>
         <!--Optional:-->
         <TI_MARA>
            <!--Zero or more repetitions:-->
            <item>
               <BAUTL></BAUTL>
               <MAKTG></MAKTG>
            </item>
         </TI_MARA>
         <!--Optional:-->
         <TI_TQ80>
            <!--Zero or more repetitions:-->
            <item>
               <QMART></QMART>
               <QMARTX></QMARTX>
            </item>
         </TI_TQ80>
      </urn:ZIMMF_TABLAS>
   </soapenv:Body>
</soapenv:Envelope>`;

      // Configurar headers para la petición SOAP
      const headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZIMMF_TABLAS',
      };

      // Realizar la petición POST a SAP
      const response = await axios.post(sapSyncUrl, soapBody, { headers });

      if (response.status === 200) {
        return {
          success: true,
          message: 'Sincronización de materiales con SAP completada exitosamente',
          data: response.data
        };
      }

      return {
        success: false,
        message: 'Error en la sincronización de materiales con SAP',
        data: response.data
      };

    } catch (error) {
      throw new HttpException(
        `Error al sincronizar materiales con SAP: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async sincronizarMateriales() {
    try {
      const response = await this.getTableMateriales();
      
      if (response.success && response.data) {
        // Parse the XML response
        const parser = new xml2js.Parser({ explicitArray: false });
        const parsedData = await parser.parseStringPromise(response.data);
        
        // Extract TI_MARA data from the parsed XML
        const soapBody = parsedData['soap-env:Envelope']['soap-env:Body'];
        const zimmfResponse = soapBody['n0:ZIMMF_TABLASResponse'];
        const tiMara = zimmfResponse['TI_MARA'];
        
        let materialesData = [];
        if (tiMara && tiMara.item) {
          // Handle both single item and array of items
          materialesData = Array.isArray(tiMara.item) ? tiMara.item : [tiMara.item];
        }
        
        // Process materiales in chunks
        let totalProcessedItems = 0;
        let totalCreatedCount = 0;
        let totalUpdatedCount = 0;
        let totalErrorCount = 0;

        for (let i = 0; i < materialesData.length; i += CHUNK_SIZE) {
          const chunk = materialesData.slice(i, i + CHUNK_SIZE);
          const upsertResult = await this.materialService.upsertMateriales(chunk);
          totalCreatedCount += upsertResult.createdCount;
          totalUpdatedCount += upsertResult.updatedCount;
          totalErrorCount += upsertResult.errorCount;
          totalProcessedItems += chunk.length;
        }
        
        return {
          success: true,
          message: 'Sincronización de materiales con SAP completada exitosamente',
          data: {
            processedItems: totalProcessedItems,
            createdCount: totalCreatedCount,
            updatedCount: totalUpdatedCount,
            errorCount: totalErrorCount
          }
        };
      }
      
      return {
        success: false,
        message: 'Error en la sincronización de materiales con SAP',
      };
      
    } catch (error) {
      throw new HttpException(
        `Error al sincronizar materiales con SAP: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async getTableTipoAvisos() {
    try {
      const sapSyncUrl = 'http://smadev.laboratoriossmart.com:8000/sap/bc/srt/rfc/sap/zws_tablas/300/zws_tablas/zws_tablas';
      
      const soapBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZIMMF_TABLAS>
         <I_OPCION>TQ80</I_OPCION>
         <!--Optional:-->
         <TI_CLAINS>
            <!--Zero or more repetitions:-->
            <item>
               <KATALOGART></KATALOGART>
               <CODEGRUPPE></CODEGRUPPE>
               <CODE></CODE>
               <KURZTEXT></KURZTEXT>
               <KATALOGART2></KATALOGART2>
            </item>
         </TI_CLAINS>
         <!--Optional:-->
         <TI_EQUIPOS>
            <!--Zero or more repetitions:-->
            <item>
               <EQUNR></EQUNR>
               <TPLNR></TPLNR>
               <GEWRK></GEWRK>
               <RBNR></RBNR>
               <EQKTX></EQKTX>
            </item>
         </TI_EQUIPOS>
         <!--Optional:-->
         <TI_MARA>
            <!--Zero or more repetitions:-->
            <item>
               <BAUTL></BAUTL>
               <MAKTG></MAKTG>
            </item>
         </TI_MARA>
         <!--Optional:-->
         <TI_TQ80>
            <!--Zero or more repetitions:-->
            <item>
               <QMART></QMART>
               <QMARTX></QMARTX>
            </item>
         </TI_TQ80>
      </urn:ZIMMF_TABLAS>
   </soapenv:Body>
</soapenv:Envelope>`;

      // Configurar headers para la petición SOAP
      const headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZIMMF_TABLAS',
      };

      // Realizar la petición POST a SAP
      const response = await axios.post(sapSyncUrl, soapBody, { headers });

      if (response.status === 200) {
        return {
          success: true,
          message: 'Sincronización de tipo avisos con SAP completada exitosamente',
          data: response.data
        };
      }

      return {
        success: false,
        message: 'Error en la sincronización de tipo avisos con SAP',
        data: response.data
      };

    } catch (error) {
      throw new HttpException(
        `Error al sincronizar tipo avisos con SAP: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async sincronizarTipoAvisos() {
    try {
      const response = await this.getTableTipoAvisos();
      
      if (response.success && response.data) {
        // Parse the XML response
        const parser = new xml2js.Parser({ explicitArray: false });
        const parsedData = await parser.parseStringPromise(response.data);
        
        // Extract TI_TQ80 data from the parsed XML
        const soapBody = parsedData['soap-env:Envelope']['soap-env:Body'];
        const zimmfResponse = soapBody['n0:ZIMMF_TABLASResponse'];
        const tiTq80 = zimmfResponse['TI_TQ80'];
        
        let tipoAvisosData = [];
        if (tiTq80 && tiTq80.item) {
          // Handle both single item and array of items
          tipoAvisosData = Array.isArray(tiTq80.item) ? tiTq80.item : [tiTq80.item];
        }
        
        // Process tipo avisos in chunks
        let totalProcessedItems = 0;
        let totalCreatedCount = 0;
        let totalUpdatedCount = 0;
        let totalErrorCount = 0;

        for (let i = 0; i < tipoAvisosData.length; i += CHUNK_SIZE) {
          const chunk = tipoAvisosData.slice(i, i + CHUNK_SIZE);
          const upsertResult = await this.tipoAvisosService.upsertTipoAvisos(chunk);
          totalCreatedCount += upsertResult.createdCount;
          totalUpdatedCount += upsertResult.updatedCount;
          totalErrorCount += upsertResult.errorCount;
          totalProcessedItems += chunk.length;
        }
        
        return {
          success: true,
          message: 'Sincronización de tipo avisos con SAP completada exitosamente',
          data: {
            processedItems: totalProcessedItems,
            createdCount: totalCreatedCount,
            updatedCount: totalUpdatedCount,
            errorCount: totalErrorCount
          }
        };
      }
      
      return {
        success: false,
        message: 'Error en la sincronización de tipo avisos con SAP',
      };
      
    } catch (error) {
      throw new HttpException(
        `Error al sincronizar tipo avisos con SAP: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
