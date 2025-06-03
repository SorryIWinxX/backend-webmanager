import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InspeccionService } from 'src/inspeccion/inspeccion.service';
import { EquiposService } from 'src/equipos/equipos.service';
import { MaterialService } from 'src/material/material.service';
import { TipoAvisosService } from 'src/tipo_avisos/tipo_avisos.service';
import { AvisosMantenimientoService } from 'src/avisos_mantenimiento/avisos_mantenimiento.service';
import { OrdernesMantenimientoService } from 'src/ordernes_mantenimiento/ordernes_mantenimiento.service';
import axios from 'axios';
import * as xml2js from 'xml2js';

const CHUNK_SIZE = 100; // Define chunk size for processing

@Injectable()
export class SapService {

  constructor(
    private readonly inspeccionService: InspeccionService,
    private readonly equiposService: EquiposService,
    private readonly materialService: MaterialService,
    private readonly tipoAvisosService: TipoAvisosService,
    private readonly avisosMantenimientoService: AvisosMantenimientoService,
    private readonly ordernesMantenimientoService: OrdernesMantenimientoService,
  ) {}

  /*
  Sincronizar tablas con SAP
  Sincronizar equipos con SAP
  Sincronizar materiales con SAP
  Sincronizar tipo avisos con SAP
  */

  async sincronizarTablas() {
    try {
      // Execute all synchronizations in parallel
      const [
        inspeccionesResult,
        equiposResult,
        materialesResult,
        tipoAvisosResult,
        ordenesMantenimientoResult
      ] = await Promise.allSettled([
        this.sincronizarInspecciones(),
        this.sincronizarEquipos(),
        this.sincronizarMateriales(),
        this.sincronizarTipoAvisos(),
        this.sincronizarOrdenesMantenimiento()
      ]);

      // Process results and handle any failures
      const results = {
        inspecciones: this.processSettledResult(inspeccionesResult, 'Inspecciones'),
        equipos: this.processSettledResult(equiposResult, 'Equipos'),
        materiales: this.processSettledResult(materialesResult, 'Materiales'),
        tipoAvisos: this.processSettledResult(tipoAvisosResult, 'Tipo Avisos'),
        ordenesMantenimiento: this.processSettledResult(ordenesMantenimientoResult, 'Órdenes de Mantenimiento')
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

  private async getTableOrdenesMantenimiento() {
    try {
      const sapSyncUrl = 'http://smadev.laboratoriossmart.com:8000/sap/bc/srt/rfc/sap/zws_lista_ordenes/300/zws_lista_ordenes/zws_lista_ordenes';
      
      const soapBody = `<soapenv:Envelope 
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:urn="urn:sap-com:document:sap:rfc:functions">
  
  <soapenv:Header/>
  <soapenv:Body>
    <urn:ZIMMF_LISTA_ORDENES>
      
      <I_STATUS>
        <OFN>X</OFN>
        <RST></RST>
        <IAR></IAR>
        <MAB></MAB>
      </I_STATUS>
      
      <TI_RANGES>
        <item>
          <FIELD_NAME>OPTIONS_FOR_PLANPLANT</FIELD_NAME>
               <SIGN>I</SIGN>
               <OPTION>EQ</OPTION>
               <LOW_VALUE>3001</LOW_VALUE>
               <HIGH_VALUE></HIGH_VALUE>
        </item>
      </TI_RANGES>
      
      <TI_RESULT/>
      
    </urn:ZIMMF_LISTA_ORDENES>
  </soapenv:Body>
</soapenv:Envelope>`;

      // Configurar headers para la petición SOAP
      const headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZIMMF_LISTA_ORDENES',
      };

      // Realizar la petición POST a SAP
      const response = await axios.post(sapSyncUrl, soapBody, { headers });

      if (response.status === 200) {
        return {
          success: true,
          message: 'Sincronización de órdenes de mantenimiento con SAP completada exitosamente',
          data: response.data
        };
      }

      return {
        success: false,
        message: 'Error en la sincronización de órdenes de mantenimiento con SAP',
        data: response.data
      };

    } catch (error) {
      throw new HttpException(
        `Error al sincronizar órdenes de mantenimiento con SAP: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async sincronizarOrdenesMantenimiento() {
    try {
      const response = await this.getTableOrdenesMantenimiento();
      
      if (response.success && response.data) {
        // Parse the XML response
        const parser = new xml2js.Parser({ explicitArray: false });
        const parsedData = await parser.parseStringPromise(response.data);
        
        // Extract TI_RESULT data from the parsed XML
        const soapBody = parsedData['soap-env:Envelope']['soap-env:Body'];
        const zimmfResponse = soapBody['n0:ZIMMF_LISTA_ORDENESResponse'];
        const tiResult = zimmfResponse['TI_RESULT'];
        
        let ordenesData = [];
        if (tiResult && tiResult.item) {
          // Handle both single item and array of items
          ordenesData = Array.isArray(tiResult.item) ? tiResult.item : [tiResult.item];
        }
        
        // Process ordenes in chunks
        let totalProcessedItems = 0;
        let totalCreatedCount = 0;
        let totalUpdatedCount = 0;
        let totalErrorCount = 0;

        for (let i = 0; i < ordenesData.length; i += CHUNK_SIZE) {
          const chunk = ordenesData.slice(i, i + CHUNK_SIZE);
          const upsertResult = await this.ordernesMantenimientoService.upsertOrdenesMantenimiento(chunk);
          totalCreatedCount += upsertResult.createdCount;
          totalUpdatedCount += upsertResult.updatedCount;
          totalErrorCount += upsertResult.errorCount;
          totalProcessedItems += chunk.length;
        }
        
        return {
          success: true,
          message: 'Sincronización de órdenes de mantenimiento con SAP completada exitosamente',
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
        message: 'Error en la sincronización de órdenes de mantenimiento con SAP',
      };
      
    } catch (error) {
      throw new HttpException(
        `Error al sincronizar órdenes de mantenimiento con SAP: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /*
  Enviar avisos de mantenimiento a SAP
  */

  async enviarAvisoMantenimiento(avisoId: number) {
    try {
      // Obtener el aviso de mantenimiento con todas sus relaciones
      const avisoMantenimiento = await this.avisosMantenimientoService.findOne(avisoId);
      
      if (!avisoMantenimiento) {
        throw new HttpException(
          'Aviso de mantenimiento no encontrado',
          HttpStatus.NOT_FOUND
        );
      }

      // Verificar que el aviso tenga los datos necesarios
      if (!avisoMantenimiento.tipoAviso?.nombre) {
        throw new HttpException(
          'El aviso debe tener un tipo de aviso válido',
          HttpStatus.BAD_REQUEST
        );
      }

      if (!avisoMantenimiento.equipo?.numeroEquipo || !avisoMantenimiento.equipo?.ubicacionTecnica || !avisoMantenimiento.equipo?.puestoTrabajo) {
        throw new HttpException(
          'El equipo debe tener número de equipo, ubicación técnica y puesto de trabajo',
          HttpStatus.BAD_REQUEST
        );
      }

      if (!avisoMantenimiento.textoBreve) {
        throw new HttpException(
          'El aviso debe tener un texto breve',
          HttpStatus.BAD_REQUEST
        );
      }

      // Construir la sección TI_LONGTEX dinámicamente basada en los items del aviso
      let tiLongTexSectionItems = '';
      let counter = 1; // Un solo contador para SUBCO y LINEA

      if (avisoMantenimiento.items && avisoMantenimiento.items.length > 0) {
        for (const item of avisoMantenimiento.items) {
          if (item.longTexts && item.longTexts.length > 0) {
            for (const longText of item.longTexts) {
              const formattedNumber = String(counter).padStart(5, '0');
              const formattedConse = String(avisoMantenimiento.id).padStart(10, '0');

              tiLongTexSectionItems += `
            <item>
               <CONSE>${formattedConse}</CONSE>
               <SUBCO>${formattedNumber}</SUBCO>
               <LINEA>${formattedNumber}</LINEA>
               <TEXT_LINE>${longText.textLine}</TEXT_LINE>
            </item>`;

              counter++;
            }
          }
        }
      }

      // Si no hay longTexts, crear una entrada vacía para evitar errores
      if (tiLongTexSectionItems === '') {
        const formattedConse = String(avisoMantenimiento.id).padStart(10, '0');
        tiLongTexSectionItems = `
            <item>
               <CONSE>${formattedConse}</CONSE>
               <SUBCO>00001</SUBCO>
               <LINEA>00001</LINEA>
               <TEXT_LINE>Texto automático - Sin texto largo especificado</TEXT_LINE>
            </item>`;
      }

      // Construir la sección TI_NOTITEM dinámicamente basada en los items del aviso
      let tiNotItemSectionItems = '';
      let itemCounter = 1;

      if (avisoMantenimiento.items && avisoMantenimiento.items.length > 0) {
        for (const item of avisoMantenimiento.items) {
          if (item.inspecciones && item.inspecciones.length > 0) {
            const formattedNumber = String(itemCounter).padStart(5, '0');
            const formattedKey = String(itemCounter).padStart(4, '0');
            const formattedConse = String(avisoMantenimiento.id).padStart(10, '0');
            
            // Agrupar todas las inspecciones del item para obtener códigos por catálogo
            const todasInspecciones = item.inspecciones;
            
            // Si hay múltiples grupos de códigos, usar el primer grupo como principal
            const gruposPorCodigo = [...new Set(todasInspecciones.map(i => i.codigoGrupo))];
            const codigoGrupoPrincipal = gruposPorCodigo[0];
            
            // Buscar códigos por catálogo en todas las inspecciones del item
            const codigoB = todasInspecciones.find(i => i.catalogo === 'B')?.codigo || '';
            const codigoC = todasInspecciones.find(i => i.catalogo === 'C')?.codigo || '';
            const codigo5 = todasInspecciones.find(i => i.catalogo === '5')?.codigo || '';
            
            // Usar la primera inspección para la descripción principal
            const inspeccionPrincipal = todasInspecciones[0];

            tiNotItemSectionItems += `
            <item>
               <CONSE>${formattedConse}</CONSE>
               <SUBCO>${formattedNumber}</SUBCO>
               <ITEM_KEY>${formattedKey}</ITEM_KEY>
               <ITEM_SORT_NO>${formattedKey}</ITEM_SORT_NO>
               <DESCRIPT>${inspeccionPrincipal.descripcion}</DESCRIPT>
               <D_CODEGRP>${codigoGrupoPrincipal}</D_CODEGRP>
               <D_CODE>${codigoB}</D_CODE>
               <DL_CODEGRP>${codigoGrupoPrincipal}</DL_CODEGRP>
               <DL_CODE>${codigoC}</DL_CODE>
               <CAUSE_KEY>${formattedKey}</CAUSE_KEY>
               <CAUSE_SORT_NO>${formattedKey}</CAUSE_SORT_NO>
               <CAUSETEXT>${inspeccionPrincipal.descripcion}</CAUSETEXT>
               <CAUSE_CODEGRP>${codigoGrupoPrincipal}</CAUSE_CODEGRP>
               <CAUSE_CODE>${codigo5}</CAUSE_CODE>
            </item>`;

            itemCounter++;
          }
        }
      }

      // Si no hay inspecciones, crear entradas vacías para evitar errores
      if (tiNotItemSectionItems === '') {
        const formattedConse = String(avisoMantenimiento.id).padStart(10, '0');
        tiNotItemSectionItems = `
            <item>
               <CONSE>${formattedConse}</CONSE>
               <SUBCO>00001</SUBCO>
               <ITEM_KEY>0001</ITEM_KEY>
               <ITEM_SORT_NO>0001</ITEM_SORT_NO>
               <DESCRIPT>Sin inspecciones especificadas</DESCRIPT>
               <D_CODEGRP>HERR01</D_CODEGRP>
               <D_CODE>10</D_CODE>
               <DL_CODEGRP>HERR01</DL_CODEGRP>
               <DL_CODE>10</DL_CODE>
               <CAUSE_KEY>0001</CAUSE_KEY>
               <CAUSE_SORT_NO>0001</CAUSE_SORT_NO>
               <CAUSETEXT>Sin inspecciones especificadas</CAUSETEXT>
               <CAUSE_CODEGRP>HERR01</CAUSE_CODEGRP>
               <CAUSE_CODE>10</CAUSE_CODE>
            </item>`;
      }

      // Construir el cuerpo SOAP
      const soapBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZIMMF_CREAR_AVISO>
         <I_NOTHEAD>
            <NOTIF_TYPE>${avisoMantenimiento.tipoAviso.nombre}</NOTIF_TYPE>
            <EQUIPMENT>${avisoMantenimiento.equipo.numeroEquipo}</EQUIPMENT>
            <FUNCT_LOC>${avisoMantenimiento.equipo.ubicacionTecnica}</FUNCT_LOC>
            <SHORT_TEXT>${avisoMantenimiento.textoBreve}</SHORT_TEXT>
            <DESSTDATE>${avisoMantenimiento.fechaInicio}</DESSTDATE>
            <DESSTTIME>${avisoMantenimiento.horaInicio}</DESSTTIME>
            <DESENDDATE>${avisoMantenimiento.fechaFin}</DESENDDATE>
            <DESENDTM>${avisoMantenimiento.horaFin}</DESENDTM>
            <PM_WKCTR>${avisoMantenimiento.equipo.puestoTrabajo}</PM_WKCTR>
            <REPORTEDBY>CONS_ABAP2</REPORTEDBY>
            <START_POINT>PUNTO DE INICIO</START_POINT>
            <END_POINT>PUNTO DE FIN</END_POINT>
            <LINEAR_LENGTH>120</LINEAR_LENGTH>
            <LINEAR_UNIT>CM</LINEAR_UNIT>
         </I_NOTHEAD>
          <TI_LONGTEX>${tiLongTexSectionItems}
         </TI_LONGTEX>
         <TI_NOTITEM>${tiNotItemSectionItems}
         </TI_NOTITEM>
      </urn:ZIMMF_CREAR_AVISO>
   </soapenv:Body>
</soapenv:Envelope>`;

      // Configurar headers para la petición SOAP con autenticación básica
      const headers = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'urn:sap-com:document:sap:rfc:functions:ZIMMF_CREAR_AVISO',
        'Authorization': 'Basic ' + Buffer.from('cons_abap2:atabak').toString('base64')
      };

      Logger.log(soapBody);
      // URL del servicio SAP
      const sapUrl = 'http://smadev.laboratoriossmart.com:8000/sap/bc/srt/rfc/sap/zws_crear_aviso/300/zws_crear_aviso/zws_crear_aviso';

      // Realizar la petición POST a SAP
      const response = await axios.post(sapUrl, soapBody, { headers });

      Logger.log(response.data);
      
      if (response.status === 200) {
        // Parsear la respuesta XML para extraer el número de aviso SAP si existe
        try {
          const parser = new xml2js.Parser({ explicitArray: false });
          const parsedData = await parser.parseStringPromise(response.data);
          
          // Aquí puedes extraer el número de aviso SAP de la respuesta si SAP lo devuelve
          // La estructura exacta depende de la respuesta de SAP
          
          // Actualizar el estado del aviso a "enviado"
          await this.avisosMantenimientoService.update(avisoId, {
            estado: 'enviado'
          });

          return {
            success: true,
            message: 'Aviso de mantenimiento enviado a SAP exitosamente',
            data: {
              avisoId: avisoId,
              sapResponse: response.data
            }
          };
        } catch (parseError) {
          // Si no se puede parsear la respuesta, aún consideramos que el envío fue exitoso
          await this.avisosMantenimientoService.update(avisoId, {
            estado: 'enviado'
          });

          return {
            success: true,
            message: 'Aviso de mantenimiento enviado a SAP exitosamente',
            data: {
              avisoId: avisoId,
              sapResponse: response.data
            }
          };
        }
      }

      // Si la respuesta no es 200, marcar como fallido
      await this.avisosMantenimientoService.update(avisoId, {
        estado: 'fallido'
      });

      return {
        success: false,
        message: 'Error al enviar aviso de mantenimiento a SAP',
        data: {
          avisoId: avisoId,
          statusCode: response.status,
          sapResponse: response.data
        }
      };

    } catch (error) {
      // Marcar el aviso como fallido
      try {
        await this.avisosMantenimientoService.update(avisoId, {
          estado: 'fallido'
        });
      } catch (updateError) {
        // Si no se puede actualizar el estado, continuar con el error original
      }

      throw new HttpException(
        `Error al enviar aviso de mantenimiento a SAP: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async enviarAvisosMantenimiento(avisosIds: number[]) {
    try {
      const results: any[] = [];
      let successCount = 0;
      let errorCount = 0;

      for (const avisoId of avisosIds) {
        try {
          const result = await this.enviarAvisoMantenimiento(avisoId);
          results.push(result);
          if (result.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
          results.push({
            success: false,
            message: `Error al enviar aviso ${avisoId}: ${error.message}`,
            data: {
              avisoId: avisoId,
              error: error.message
            }
          });
        }
      }

      return {
        success: errorCount === 0,
        message: `Procesados ${avisosIds.length} avisos. ${successCount} exitosos, ${errorCount} fallidos`,
        data: {
          totalProcessed: avisosIds.length,
          successCount,
          errorCount,
          results
        }
      };

    } catch (error) {
      throw new HttpException(
        `Error al procesar avisos de mantenimiento: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}