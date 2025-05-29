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

  async upsertTipoAvisos(tipoAvisosData: any[]) {
    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const data of tipoAvisosData) {
      try {
        const nombre = data.QMART;
        
        if (!nombre) {
          errorCount++;
          continue;
        }

        // Check if tipo aviso already exists by nombre
        const existingTipoAviso = await this.tipoAvisoRepository.findOne({
          where: { nombre }
        });

        if (existingTipoAviso) {
          // Update existing record
          existingTipoAviso.descripcion = data.QMARTX;
          
          await this.tipoAvisoRepository.save(existingTipoAviso);
          updatedCount++;
        } else {
          // Create new tipo aviso
          const newTipoAviso = this.tipoAvisoRepository.create({
            nombre: nombre,
            descripcion: data.QMARTX
          });
          await this.tipoAvisoRepository.save(newTipoAviso);
          createdCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    return { createdCount, updatedCount, errorCount };
  }
}
