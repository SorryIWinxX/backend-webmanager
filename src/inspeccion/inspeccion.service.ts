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

  async findByCodigoGrupoAndCatalogo(codigoGrupo: string, catalogo: string) {
    return this.inspeccionRepository.find({
      where: {
        codigoGrupo,
        catalogo
      },
      order: {
        codigo: 'ASC'
      }
    });
  }

  async findHierarchyByCodigoGrupo(codigoGrupo: string) {
    const inspecciones = await this.inspeccionRepository.find({
      where: { codigoGrupo },
      order: {
        catalogo: 'ASC',
        codigo: 'ASC'
      }
    });

    // Group by catalogo to create hierarchy
    const hierarchy = inspecciones.reduce((acc, inspeccion) => {
      if (!acc[inspeccion.catalogo]) {
        acc[inspeccion.catalogo] = [];
      }
      acc[inspeccion.catalogo].push({
        id: inspeccion.id,
        codigo: inspeccion.codigo,
        descripcion: inspeccion.descripcion
      });
      return acc;
    }, {});

    return {
      codigoGrupo,
      categorias: hierarchy
    };
  }

  async searchInspecciones(codigoGrupo: string, catalogo?: string) {
    const whereCondition: any = { codigoGrupo };
    
    if (catalogo) {
      whereCondition.catalogo = catalogo;
    }

    const inspecciones = await this.inspeccionRepository.find({
      where: whereCondition,
      order: {
        catalogo: 'ASC',
        codigo: 'ASC'
      }
    });

    if (catalogo) {
      // Return specific category
      return {
        codigoGrupo,
        catalogo,
        inspecciones: inspecciones.map(insp => ({
          id: insp.id,
          codigo: insp.codigo,
          descripcion: insp.descripcion
        }))
      };
    } else {
      // Return hierarchy for all categories
      return this.findHierarchyByCodigoGrupo(codigoGrupo);
    }
  }

  async upsertInspecciones(inspeccionesData: any[]) {
    let createdCount = 0;
    let errorCount = 0;
    let updatedCount = 0;
    
    for (const data of inspeccionesData) {
      try {
        const codigo = data.CODE || data.CODEGRUPPE;
        
        if (!codigo) {
          errorCount++;
          continue;
        }

        // Check if inspection already exists by all 4 fields
        const existingInspeccion = await this.inspeccionRepository.findOneBy({
          codigoGrupo: data.CODEGRUPPE,
          catalogo: data.KATALOGART,
          codigo: data.CODE,
          descripcion: data.KURZTEXT,
        });
        
        if (existingInspeccion) {
          // If it already exists with same values, skip creation
          updatedCount++;
          continue;
        }

        // Create new inspection only if it doesn't exist with these exact values
        const newInspeccion = this.inspeccionRepository.create({
          codigoGrupo: data.CODEGRUPPE,
          catalogo: data.KATALOGART,
          codigo: data.CODE,
          descripcion: data.KURZTEXT,
        });
        await this.inspeccionRepository.save(newInspeccion);
        createdCount++;
      } catch (error) {
        errorCount++;
      }
    }

    return { createdCount, errorCount, updatedCount };
  }
  
}
