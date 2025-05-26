import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateParteObjetoDto } from './dto/create-parte_objeto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ParteObjeto } from './entities/parte-objeto.entity';
import { Repository } from 'typeorm';
import { Sensor } from 'src/sensor/entities/sensor.entity';

@Injectable()
export class ParteObjetoService {
  constructor(
    @InjectRepository(ParteObjeto)
    private parteObjetoRepository: Repository<ParteObjeto>,

    @InjectRepository(Sensor)
    private sensorRepository: Repository<Sensor>,
  ) {}

  async create(createParteObjetoDto: CreateParteObjetoDto) {
    const sensor = await this.validateSensor(createParteObjetoDto.sensor);
    const parteObjeto = new ParteObjeto();
    parteObjeto.nombre = createParteObjetoDto.nombre;
    parteObjeto.sensor = sensor;
    return this.parteObjetoRepository.save(parteObjeto);
  }

  findAll() {
    return this.parteObjetoRepository.find();
  }

  async validateSensor(sensorId: number) {
    const sensor = await this.sensorRepository.findOneBy({id: sensorId});
    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }
    return sensor;
  }

}
