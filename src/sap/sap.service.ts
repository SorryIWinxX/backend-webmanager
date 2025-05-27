import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AvisosMantenimientoService } from 'src/avisos_mantenimiento/avisos_mantenimiento.service';
import axios from 'axios';

@Injectable()
export class SapService {
  private readonly sapUrl = 'http://smadev.laboratoriossmart.com:8000/sap/bc/srt/rfc/sap/zws_crear_aviso/300/zws_crear_aviso/zws_crear_aviso';

  constructor(
    private readonly avisosMantenimientoService: AvisosMantenimientoService,
  ) {}

  async enviarAvisoMantenimiento(id: number) {
    try {
      // Obtener el aviso de mantenimiento con todas sus relaciones
      const aviso = await this.avisosMantenimientoService.findOne(id);
      
      if (!aviso) {
        throw new HttpException('Aviso de mantenimiento no encontrado', HttpStatus.NOT_FOUND);
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

      // Enviar petición a SAP
      const response = await axios.post(this.sapUrl, soapBody, { headers });

      // Actualizar estado del aviso según la respuesta
      if (response.status === 200) {
        // Aquí podrías actualizar el estado del aviso a 'enviado'
        // await this.avisosMantenimientoService.updateEstado(id, 'enviado');
        return {
          success: true,
          message: 'Aviso enviado exitosamente a SAP',
          data: response.data
        };
      }

      return {
        success: false,
        message: 'Error al enviar aviso a SAP',
        data: response.data
      };

    } catch (error) {
      // Actualizar estado del aviso a 'fallido'
      // await this.avisosMantenimientoService.updateEstado(id, 'fallido');
      
      throw new HttpException(
        `Error al enviar aviso a SAP: ${error.message}`,
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

  async sincronizarAvisosMantenimiento() {
    return 'This action synchronizes avisos mantenimiento';
  }
}
