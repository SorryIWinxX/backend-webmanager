import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLongTextDto } from './dto/create-long_text.dto';
import { UpdateLongTextDto } from './dto/update-long_text.dto';
import { LongText } from './entities/long_text.entity';

@Injectable()
export class LongTextService {
  constructor(
    @InjectRepository(LongText)
    private readonly longTextRepository: Repository<LongText>,
  ) {}

  create(createLongTextDto: CreateLongTextDto) {
    const longText = this.longTextRepository.create(createLongTextDto);
    return this.longTextRepository.save(longText);
  }

  findAll() {
    return this.longTextRepository.find();
  }

  findOne(id: number) {
    return this.longTextRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateLongTextDto: UpdateLongTextDto) {
    return this.longTextRepository.update(id, updateLongTextDto);
  }

  remove(id: number) {
    return this.longTextRepository.delete(id);
  }
}
