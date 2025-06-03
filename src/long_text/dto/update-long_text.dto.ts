import { PartialType } from '@nestjs/swagger';
import { CreateLongTextDto } from './create-long_text.dto';

export class UpdateLongTextDto extends PartialType(CreateLongTextDto) {}
