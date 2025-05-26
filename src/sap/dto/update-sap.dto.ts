import { PartialType } from '@nestjs/mapped-types';
import { CreateSapDto } from './create-sap.dto';

export class UpdateSapDto extends PartialType(CreateSapDto) {}
