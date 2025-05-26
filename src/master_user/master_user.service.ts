import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMasterUserDto } from './dto/create-master_user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterUser } from 'src/master_user/entities/master-user.entity';

@Injectable()
export class MasterUserService {

  constructor(
    @InjectRepository(MasterUser)
    private readonly masterUserRepository: Repository<MasterUser>,
  ) {}

  create(createMasterUserDto: CreateMasterUserDto) {
    const masterUser = this.masterUserRepository.create(createMasterUserDto);
    return this.masterUserRepository.save(masterUser);
  }

  findAll() {
    return this.masterUserRepository.find();
  }

  findOne(id: number) {
    return this.masterUserRepository.findOneBy({id});
  }

  remove(id: number) {
    return this.masterUserRepository.softDelete(id);
  }
}
