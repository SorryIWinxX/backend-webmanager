import { Injectable } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { Material } from './entities/material.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MaterialService {

  constructor(
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
  ) {}

  create(createMaterialDto: CreateMaterialDto) {

    const material = this.materialRepository.create(createMaterialDto);
    return this.materialRepository.save(material);
  }

  findAll() {
    return this.materialRepository.find();
  }

  findOne(id: number) {
    return this.materialRepository.findOneBy({ id });
  }
}
