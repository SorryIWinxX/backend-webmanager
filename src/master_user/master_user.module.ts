import { Module } from '@nestjs/common';
import { MasterUserService } from './master_user.service';
import { MasterUserController } from './master_user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterUser } from 'src/master_user/entities/master-user.entity';

@Module(
  {
    imports: [TypeOrmModule.forFeature([MasterUser])],
    controllers: [MasterUserController],
    providers: [MasterUserService],
})
export class MasterUserModule {}
