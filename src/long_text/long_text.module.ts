import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LongTextService } from './long_text.service';
import { LongTextController } from './long_text.controller';
import { LongText } from './entities/long_text.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LongText])],
  controllers: [LongTextController],
  providers: [LongTextService],
  exports: [LongTextService],
})
export class LongTextModule {}
