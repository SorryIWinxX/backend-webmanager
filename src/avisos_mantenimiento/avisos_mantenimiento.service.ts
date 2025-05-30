import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvisosMantenimientoDto } from './dto/create-avisos_mantenimiento.dto';
import { AvisoMantenimiento } from './entities/aviso-mantenimiento.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterUser } from 'src/master_user/entities/master-user.entity';
import { TipoAviso } from 'src/tipo_avisos/entities/tipo-aviso.entity';
import { Equipo } from 'src/equipos/entities/equipo.entity';
import { ParteObjeto } from 'src/parte_objeto/entities/parte-objeto.entity';
import { ReporterUser } from 'src/reporter_user/entities/reporter-user.entity';
import { Inspeccion } from 'src/inspeccion/entities/inspeccion.entity';
import { Material } from 'src/material/entities/material.entity';

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

    @InjectRepository(ParteObjeto)
    private parteObjetoRepository: Repository<ParteObjeto>,

    @InjectRepository(ReporterUser)
    private reporterUserRepository: Repository<ReporterUser>,

    @InjectRepository(Inspeccion)
    private inspeccionRepository: Repository<Inspeccion>,

    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
  ) {}

  async create(createAvisosMantenimientoDto: CreateAvisosMantenimientoDto) {
    const masterUser = await this.validateMasterUser(createAvisosMantenimientoDto.masterUser);
    const tipoAviso = await this.validateTipoAviso(createAvisosMantenimientoDto.tipoAviso);
    const equipo = await this.validateEquipo(createAvisosMantenimientoDto.equipo);
    const parteObjeto = await this.validateParteObjeto(createAvisosMantenimientoDto.parteObjeto);
    const reporterUser = await this.validateReporterUser(createAvisosMantenimientoDto.reporterUser);
    const inspeccion = await this.validateInspeccion(createAvisosMantenimientoDto.inspeccion);
    const material = await this.validateMaterial(createAvisosMantenimientoDto.material);
    const avisoMantenimiento = await this.avisosMantenimientoRepository.save({
      ...createAvisosMantenimientoDto,
      tipoAviso: tipoAviso,
      masterUser: masterUser,
      equipo: equipo,
      parteObjeto: parteObjeto,
      reporterUser: reporterUser,
      inspeccion: inspeccion,
      material: material,
    });

    return avisoMantenimiento;
  }

  async findAll() {
    return this.avisosMantenimientoRepository.find();
  }

  async findOne(id: number) {
    const avisoMantenimiento = await this.avisosMantenimientoRepository.findOneBy({id: id});
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

  private async validateParteObjeto(parteObjetoId: number) {
    const parteObjeto = await this.parteObjetoRepository.findOneBy({id: parteObjetoId});
    if (!parteObjeto) {
      throw new NotFoundException('Parte objeto not found');
    }
    return parteObjeto;
  }

  private async validateReporterUser(reporterUserId: number) {
    const reporterUser = await this.reporterUserRepository.findOneBy({id: reporterUserId});
    if (!reporterUser) {
      throw new NotFoundException('Reporter user not found');
    }
    return reporterUser;
  }

  private async validateInspeccion(inspeccionId: number) {
    const inspeccion = await this.inspeccionRepository.findOneBy({id: inspeccionId});
    if (!inspeccion) {
      throw new NotFoundException('Inspeccion not found');
    }
    return inspeccion;
  }

  private async validateMaterial(materialId: number) {
    const material = await this.materialRepository.findOneBy({id: materialId});
    if (!material) {
      throw new NotFoundException('Material not found');
    }
    return material;
  }
}
