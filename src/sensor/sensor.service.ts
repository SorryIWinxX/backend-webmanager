import { Injectable } from '@nestjs/common';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor } from './entities/sensor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(Sensor)
    private sensorRepository: Repository<Sensor>,
  ) {}

  async create(createSensorDto: CreateSensorDto) {
    const sensor = this.sensorRepository.create(createSensorDto);
    return this.sensorRepository.save(sensor);
  }

  findAll() {
    return this.sensorRepository.find();
  }

}
