import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAvisoCreadoDto } from './dto/create-aviso_creado.dto';
import { UpdateAvisoCreadoDto } from './dto/update-aviso_creado.dto';
import { AvisoCreado } from './entities/aviso_creado.entity';

@Injectable()
export class AvisoCreadosService {
  constructor(
    @InjectRepository(AvisoCreado)
    private avisoCreadoRepository: Repository<AvisoCreado>,
  ) {}

  create(createAvisoCreadoDto: CreateAvisoCreadoDto) {
    return 'This action adds a new avisoCreado';
  }

  findAll() {
    return `This action returns all avisoCreados`;
  }

  findOne(id: number) {
    return `This action returns a #${id} avisoCreado`;
  }

  update(id: number, updateAvisoCreadoDto: UpdateAvisoCreadoDto) {
    return `This action updates a #${id} avisoCreado`;
  }

  remove(id: number) {
    return `This action removes a #${id} avisoCreado`;
  }

  async upsertAvisosCreados(avisosData: any[]): Promise<{ createdCount: number; updatedCount: number; errorCount: number }> {
    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const avisoData of avisosData) {
      try {
        // Check if aviso already exists by QMNUM
        const existingAviso = await this.avisoCreadoRepository.findOne({
          where: { qmnum: avisoData.QMNUM }
        });

        // Prepare the data object with proper typing
        const avisoToSave: Partial<AvisoCreado> = {
          qmnum: avisoData.QMNUM,
          qmart: avisoData.QMART,
          equnr: avisoData.EQUNR,
          tplnr: avisoData.TPLNR,
          qmtxt: avisoData.QMTXT,
          bautl: avisoData.BAUTL,
          arbpl: avisoData.ARBPL,
          qmnam: avisoData.QMNAM,
        };

        // Handle date fields separately to avoid null type issues
        if (avisoData.STRMN && avisoData.STRMN !== '0000-00-00') {
          avisoToSave.strmn = new Date(avisoData.STRMN);
        }
        
        if (avisoData.STRUR && avisoData.STRUR !== '00:00:00') {
          avisoToSave.strur = avisoData.STRUR;
        }
        
        if (avisoData.LTRMN && avisoData.LTRMN !== '0000-00-00') {
          avisoToSave.ltrmn = new Date(avisoData.LTRMN);
        }
        
        if (avisoData.LTRUR && avisoData.LTRUR !== '00:00:00') {
          avisoToSave.ltrur = avisoData.LTRUR;
        }

        if (existingAviso) {
          // Update existing aviso
          await this.avisoCreadoRepository.update(existingAviso.id, avisoToSave);
          updatedCount++;
        } else {
          // Create new aviso
          const newAviso = this.avisoCreadoRepository.create(avisoToSave);
          await this.avisoCreadoRepository.save(newAviso);
          createdCount++;
        }
      } catch (error) {
        console.error(`Error processing aviso ${avisoData.QMNUM}:`, error);
        errorCount++;
      }
    }

    return { createdCount, updatedCount, errorCount };
  }
}
