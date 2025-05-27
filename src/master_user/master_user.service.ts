import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMasterUserDto } from './dto/create-master_user.dto';
import { LoginMasterUserDto } from './dto/login-master_user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterUser } from 'src/master_user/entities/master-user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MasterUserService {

  constructor(
    @InjectRepository(MasterUser)
    private readonly masterUserRepository: Repository<MasterUser>,
  ) {}

  async create(createMasterUserDto: CreateMasterUserDto) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createMasterUserDto.password, saltRounds);
    
    const masterUser = this.masterUserRepository.create({
      ...createMasterUserDto,
      password: hashedPassword
    });
    
    return this.masterUserRepository.save(masterUser);
  }

  async login(loginMasterUserDto: LoginMasterUserDto) {
    const { username, password } = loginMasterUserDto;
    
    const masterUser = await this.masterUserRepository.findOne({
      where: { username }
    });

    if (!masterUser) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, masterUser.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      id: masterUser.id,
      username: masterUser.username,
      message: 'Login exitoso'
    };
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
