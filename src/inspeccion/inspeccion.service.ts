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

  async upsertInspecciones(inspeccionesData: any[]) {
    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const data of inspeccionesData) {
      try {
        const codigo = data.CODE || data.CODEGRUPPE;
        
        if (!codigo) {
          errorCount++;
          continue;
        }

        // Check if inspection already exists by codigo
        const existingInspeccion = await this.inspeccionRepository.findOne({
          where: { codigo }
        });

        if (existingInspeccion) {
          // Update existing record
          existingInspeccion.catalogo = data.KATALOGART;
          existingInspeccion.descripcion = data.KURZTEXT;
          existingInspeccion.catalago2 = data.KATALOGART2 || '';
          
          await this.inspeccionRepository.save(existingInspeccion);
          updatedCount++;
        } else {
          // Create new inspection
          const newInspeccion = this.inspeccionRepository.create({
            catalogo: data.KATALOGART,
            codigo: codigo,
            descripcion: data.KURZTEXT,
            catalago2: data.KATALOGART2 || ''
          });
          await this.inspeccionRepository.save(newInspeccion);
          createdCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    return { createdCount, updatedCount, errorCount };
  }
  
}
