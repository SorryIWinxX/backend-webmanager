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

  async upsertMateriales(materialesData: any[]) {
    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const data of materialesData) {
      try {
        const conjunto = data.BAUTL;
        
        if (!conjunto) {
          errorCount++;
          continue;
        }

        // Check if material already exists by conjunto
        const existingMaterial = await this.materialRepository.findOne({
          where: { conjunto }
        });

        if (existingMaterial) {
          // Update existing record
          existingMaterial.description = data.MAKTG;
          
          await this.materialRepository.save(existingMaterial);
          updatedCount++;
        } else {
          // Create new material
          const newMaterial = this.materialRepository.create({
            conjunto: conjunto,
            description: data.MAKTG
          });
          await this.materialRepository.save(newMaterial);
          createdCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    return { createdCount, updatedCount, errorCount };
  }
}
