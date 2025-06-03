import { PartialType } from '@nestjs/swagger';
import { CreateSapDto } from './create-sap.dto';

export class UpdateSapDto extends PartialType(CreateSapDto) {}
