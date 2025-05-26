import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReporterUserDto } from './dto/create-reporter_user.dto';
import { ReporterUser } from './entities/reporter-user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PuestoTrabajo } from 'src/puesto_trabajo/entities/puesto-trabajo.entity';

@Injectable()
export class ReporterUserService {
  constructor(
    @InjectRepository(ReporterUser)
    private reporterUserRepository: Repository<ReporterUser>,

    @InjectRepository(PuestoTrabajo)
    private puestoTrabajoRepository: Repository<PuestoTrabajo>,
  ) {}

  async create(createReporterUserDto: CreateReporterUserDto) {
    const puestoTrabajo = await this.validatePuestoTrabajo(createReporterUserDto.puestoTrabajo);
    const reporterUser = new ReporterUser();
    reporterUser.cedula = createReporterUserDto.cedula;
    reporterUser.puestoTrabajo = puestoTrabajo;
    return this.reporterUserRepository.save(reporterUser);
  }

  findAll() {
    return this.reporterUserRepository.find();
  }

  remove(id: number) {
    return this.reporterUserRepository.delete(id);
  }

  private async validatePuestoTrabajo(puestoTrabajoId: number) {
    const puestoTrabajo = await this.puestoTrabajoRepository.findOneBy({id: puestoTrabajoId});
    if (!puestoTrabajo) {
      throw new NotFoundException('Puesto de trabajo no encontrado');
    }
    return puestoTrabajo;
  }
}
