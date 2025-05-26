import { Injectable } from '@nestjs/common';
import { CreateTipoAvisoDto } from './dto/create-tipo_aviso.dto';
import { UpdateTipoAvisoDto } from './dto/update-tipo_aviso.dto';
import { TipoAviso } from './entities/tipo-aviso.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TipoAvisosService {
  constructor(
    @InjectRepository(TipoAviso)
    private tipoAvisoRepository: Repository<TipoAviso>,
  ) {}

  create(createTipoAvisoDto: CreateTipoAvisoDto) {
    return this.tipoAvisoRepository.save(createTipoAvisoDto);
  }

  findAll() {
    return this.tipoAvisoRepository.find();
  }

  
}
