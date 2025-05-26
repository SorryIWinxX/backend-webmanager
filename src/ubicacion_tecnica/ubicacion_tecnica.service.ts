import { Injectable } from '@nestjs/common';
import { CreateUbicacionTecnicaDto } from './dto/create-ubicacion_tecnica.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UbicacionTecnica } from './entities/ubicacion-tecnica.entity';

@Injectable()
export class UbicacionTecnicaService {
  constructor(
    @InjectRepository(UbicacionTecnica)
    private ubicacionTecnicaRepository: Repository<UbicacionTecnica>,
  ) {}

  async create(createUbicacionTecnicaDto: CreateUbicacionTecnicaDto) {
    const ubicacionTecnica = this.ubicacionTecnicaRepository.create(createUbicacionTecnicaDto);
    return this.ubicacionTecnicaRepository.save(ubicacionTecnica);
  }

  findAll() {
    return this.ubicacionTecnicaRepository.find();
  }

}
