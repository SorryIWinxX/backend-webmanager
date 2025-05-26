import { Injectable } from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from './entities/equipo.entity';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private equipoRepository: Repository<Equipo>,
  ) {}

  create(createEquipoDto: CreateEquipoDto) {
    return this.equipoRepository.save(createEquipoDto);
  }

  findAll() {
    return this.equipoRepository.find();
  }

}
