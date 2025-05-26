import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MasterUserService } from './master_user.service';
import { CreateMasterUserDto } from './dto/create-master_user.dto';

@Controller('master-user')
export class MasterUserController {
  constructor(private readonly masterUserService: MasterUserService) {}

  @Post()
  create(@Body() createMasterUserDto: CreateMasterUserDto) {
    return this.masterUserService.create(createMasterUserDto);
  }

  @Get()
  findAll() {
    return this.masterUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.masterUserService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.masterUserService.remove(+id);
  }
}
