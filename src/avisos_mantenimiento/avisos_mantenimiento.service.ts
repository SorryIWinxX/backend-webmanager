import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvisosMantenimientoDto } from './dto/create-avisos_mantenimiento.dto';
import { AvisoMantenimiento } from './entities/aviso-mantenimiento.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterUser } from 'src/master_user/entities/master-user.entity';
import { TipoAviso } from 'src/tipo_avisos/entities/tipo-aviso.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { ReporterUser } from 'src/reporter_user/entities/reporter-user.entity';
import { Material } from 'src/material/entities/material.entity';
import { LongText } from 'src/long_text/entities/long_text.entity';
import { ItemsService } from 'src/items/items.service';
import { Item } from 'src/items/entities/item.entity';

@Injectable()
export class AvisosMantenimientoService {
  constructor(
    @InjectRepository(AvisoMantenimiento)
    private avisosMantenimientoRepository: Repository<AvisoMantenimiento>,

    @InjectRepository(MasterUser)
    private masterUserRepository: Repository<MasterUser>,

    @InjectRepository(TipoAviso)
    private tipoAvisoRepository: Repository<TipoAviso>,

    @InjectRepository(Equipo)
    private equipoRepository: Repository<Equipo>,

    @InjectRepository(ReporterUser)
    private reporterUserRepository: Repository<ReporterUser>,

    @InjectRepository(Material)
    private materialRepository: Repository<Material>,

    @InjectRepository(LongText)
    private longTextRepository: Repository<LongText>,

    private itemsService: ItemsService,
  ) {}

  async create(createAvisosMantenimientoDto: CreateAvisosMantenimientoDto) {
    const masterUser = await this.validateMasterUser(createAvisosMantenimientoDto.masterUser);
    const tipoAviso = await this.validateTipoAviso(createAvisosMantenimientoDto.tipoAviso);
    const equipo = await this.validateEquipo(createAvisosMantenimientoDto.equipo);
    const reporterUser = await this.validateReporterUser(createAvisosMantenimientoDto.reporterUser);
    const material = await this.validateMaterial(createAvisosMantenimientoDto.material);
    
    const avisoMantenimiento = await this.avisosMantenimientoRepository.save({
      numeroExt: createAvisosMantenimientoDto.numeroExt,
      textoBreve: createAvisosMantenimientoDto.textoBreve,
      fechaInicio: createAvisosMantenimientoDto.fechaInicio,
      fechaFin: createAvisosMantenimientoDto.fechaFin,
      horaInicio: createAvisosMantenimientoDto.horaInicio,
      horaFin: createAvisosMantenimientoDto.horaFin,
      tipoAviso: tipoAviso,
      masterUser: masterUser,
      equipo: equipo,
      reporterUser: reporterUser,
      material: material,
    });

    if (createAvisosMantenimientoDto.items && createAvisosMantenimientoDto.items.length > 0) {
      const items: Item[] = [];
      
      for (const itemData of createAvisosMantenimientoDto.items) {
        // Crear los longTexts si existen
        let longTextsData: { linea: string; textLine: string; }[] | undefined = undefined;
        if (itemData.longTextIds && itemData.longTextIds.length > 0) {
          longTextsData = itemData.longTextIds.map(longText => ({
            linea: longText.linea,
            textLine: longText.textLine,
          }));
        }

        const item = await this.itemsService.create({
          longTexts: longTextsData,
          inspeccionIds: itemData.inspeccionIds,
        });
        
        items.push(item);
      }

      avisoMantenimiento.items = items;
      await this.avisosMantenimientoRepository.save(avisoMantenimiento);
    }

    return avisoMantenimiento;
  }

  async findAll() {
    return await this.avisosMantenimientoRepository
      .createQueryBuilder('aviso')
      .leftJoinAndSelect('aviso.tipoAviso', 'tipoAviso')
      .leftJoinAndSelect('aviso.masterUser', 'masterUser')
      .leftJoinAndSelect('aviso.equipo', 'equipo')
      .leftJoinAndSelect('aviso.reporterUser', 'reporterUser')
      .leftJoinAndSelect('aviso.material', 'material')
      .leftJoinAndSelect('aviso.items', 'items')
      .leftJoinAndSelect('items.longTexts', 'longTexts')
      .leftJoinAndSelect('items.inspecciones', 'inspecciones')
      .getMany();
  }

  async findOne(id: number) {
    const avisoMantenimiento = await this.avisosMantenimientoRepository
      .createQueryBuilder('aviso')
      .leftJoinAndSelect('aviso.tipoAviso', 'tipoAviso')
      .leftJoinAndSelect('aviso.masterUser', 'masterUser')
      .leftJoinAndSelect('aviso.equipo', 'equipo')
      .leftJoinAndSelect('aviso.reporterUser', 'reporterUser')
      .leftJoinAndSelect('aviso.material', 'material')
      .leftJoinAndSelect('aviso.items', 'items')
      .leftJoinAndSelect('items.longTexts', 'longTexts')
      .leftJoinAndSelect('items.inspecciones', 'inspecciones')
      .where('aviso.id = :id', { id })
      .getOne();
      
    if (!avisoMantenimiento) {
      throw new NotFoundException('Aviso de mantenimiento not found');
    }
    return avisoMantenimiento;
  }

  async update(id: number, updateData: Partial<AvisoMantenimiento>) {
    const avisoMantenimiento = await this.findOne(id);
    Object.assign(avisoMantenimiento, updateData);
    return this.avisosMantenimientoRepository.save(avisoMantenimiento);
  }

  private async validateMasterUser(masterUserId: number) {
    const masterUser = await this.masterUserRepository.findOneBy({id: masterUserId});
    if (!masterUser) {
      throw new NotFoundException('Master user not found');
    }
    return masterUser;
  }

  private async validateTipoAviso(tipoAvisoId: number) {
    const tipoAviso = await this.tipoAvisoRepository.findOneBy({id: tipoAvisoId});
    if (!tipoAviso) {
      throw new NotFoundException('Tipo aviso not found');
    }
    return tipoAviso;
  }

  private async validateEquipo(equipoId: number) {
    const equipo = await this.equipoRepository.findOneBy({id: equipoId});
    if (!equipo) {
      throw new NotFoundException('Equipo not found');
    }
    return equipo;
  }

  private async validateReporterUser(reporterUserId: number) {
    const reporterUser = await this.reporterUserRepository.findOneBy({id: reporterUserId});
    if (!reporterUser) {
      throw new NotFoundException('Reporter user not found');
    }
    return reporterUser;
  }

  private async validateMaterial(materialId: number) {
    const material = await this.materialRepository.findOneBy({id: materialId});
    if (!material) {
      throw new NotFoundException('Material not found');
    }
    return material;
  }
}
