import { Injectable } from '@nestjs/common';
import { CreateInspeccionDto } from './dto/create-inspeccion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspeccion } from './entities/inspeccion.entity';

@Injectable()
export class InspeccionService {

  constructor(
    @InjectRepository(Inspeccion)
    private inspeccionRepository: Repository<Inspeccion>,
  ) {}

  async create(createInspeccionDto: CreateInspeccionDto) {
    const inspeccion = this.inspeccionRepository.create(createInspeccionDto);
    return this.inspeccionRepository.save(inspeccion);
  }

  async findAll() {
    return this.inspeccionRepository.find();
  }

  async findOne(id: number) {
    return this.inspeccionRepository.findOneBy({ id });
  }
  
}
