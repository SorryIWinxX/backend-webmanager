import { Injectable } from '@nestjs/common';
import { CreatePuestoTrabajoDto } from './dto/create-puesto_trabajo.dto';
import { PuestoTrabajo } from './entities/puesto-trabajo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PuestoTrabajoService {
  constructor(
    @InjectRepository(PuestoTrabajo)
    private puestoTrabajoRepository: Repository<PuestoTrabajo>,
  ) {}

  create(createPuestoTrabajoDto: CreatePuestoTrabajoDto) {
    const puestoTrabajo = this.puestoTrabajoRepository.create(createPuestoTrabajoDto);
    return this.puestoTrabajoRepository.save(puestoTrabajo);
  }

  findAll() {
    return this.puestoTrabajoRepository.find();
  }

}
