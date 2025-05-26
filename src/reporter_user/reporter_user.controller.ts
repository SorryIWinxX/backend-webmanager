import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReporterUserService } from './reporter_user.service';
import { CreateReporterUserDto } from './dto/create-reporter_user.dto';

@Controller('reporter-user')
export class ReporterUserController {
  constructor(private readonly reporterUserService: ReporterUserService) {}

  @Post()
  create(@Body() createReporterUserDto: CreateReporterUserDto) {
    return this.reporterUserService.create(createReporterUserDto);
  }

  @Get()
  findAll() {
    return this.reporterUserService.findAll();
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reporterUserService.remove(+id);
  }
}
