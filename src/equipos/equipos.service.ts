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

  async upsertEquipos(equiposData: any[]) {
    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const data of equiposData) {
      try {
        const numeroEquipo = data.EQUNR;
        
        if (!numeroEquipo) {
          errorCount++;
          continue;
        }

        // Check if equipo already exists by numeroEquipo
        const existingEquipo = await this.equipoRepository.findOne({
          where: { numeroEquipo }
        });

        if (existingEquipo) {
          // Update existing record
          existingEquipo.ubicacionTecnica = data.TPLNR;
          existingEquipo.puestoTrabajo = data.GEWRK;
          existingEquipo.perfilCatalogo = data.RBNR;
          existingEquipo.objetoTecnico = data.EQKTX;
          
          await this.equipoRepository.save(existingEquipo);
          updatedCount++;
        } else {
          // Create new equipo
          const newEquipo = this.equipoRepository.create({
            numeroEquipo: numeroEquipo,
            ubicacionTecnica: data.TPLNR,
            puestoTrabajo: data.GEWRK,
            perfilCatalogo: data.RBNR,
            objetoTecnico: data.EQKTX
          });
          await this.equipoRepository.save(newEquipo);
          createdCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    return { createdCount, updatedCount, errorCount };
  }
}
