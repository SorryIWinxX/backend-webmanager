import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateItemsBatchDto } from './dto/create-items-batch.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { LongText } from '../long_text/entities/long_text.entity';
import { Inspeccion } from '../inspeccion/entities/inspeccion.entity';
import { AvisoMantenimiento } from '../avisos_mantenimiento/entities/aviso-mantenimiento.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(LongText)
    private longTextRepository: Repository<LongText>,
    @InjectRepository(Inspeccion)
    private inspeccionRepository: Repository<Inspeccion>,
    @InjectRepository(AvisoMantenimiento)
    private avisoMantenimientoRepository: Repository<AvisoMantenimiento>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const item = this.itemRepository.create();
    
    // Asignar campos básicos
    if (createItemDto.SUBCO) item.SUBCO = createItemDto.SUBCO;
    
    // Crear LongText si se proporciona
    if (createItemDto.longTexts) {
      const longText = this.longTextRepository.create(createItemDto.longTexts);
      const savedLongText = await this.longTextRepository.save(longText);
      item.longTexts = savedLongText;
    }
    
    // Crear Inspeccion si se proporciona
    if (createItemDto.inspecciones) {
      const inspeccion = this.inspeccionRepository.create(createItemDto.inspecciones);
      const savedInspeccion = await this.inspeccionRepository.save(inspeccion);
      item.inspecciones = savedInspeccion;
    }

    // Manejar inspecciones existentes por ID si se proporcionan
    if (createItemDto.inspeccionIds && createItemDto.inspeccionIds.length > 0) {
      const existingInspecciones = await this.inspeccionRepository.find({
        where: { id: In(createItemDto.inspeccionIds) }
      });
      item.inspecciones = existingInspecciones;
    }
    
    // Manejar avisos de mantenimiento si se proporcionan
    if (createItemDto.avisoMantenimientoIds) {
      item.avisoMantenimientos = await this.avisoMantenimientoRepository.find({
        where: { id: In(createItemDto.avisoMantenimientoIds) }
      });
    }
    
    return await this.itemRepository.save(item);
  }

  async createBatch(createItemsBatchDto: CreateItemsBatchDto) {
    const createdItems: Item[] = [];
    
    for (const itemDto of createItemsBatchDto.items) {
      const createdItem = await this.create(itemDto);
      createdItems.push(createdItem);
    }
    
    return createdItems;
  }

  async findAll() {
    return await this.itemRepository.find({
      relations: ['longTexts', 'inspecciones', 'avisoMantenimientos']
    });
  }

  async findOne(id: number) {
    return await this.itemRepository.findOne({
      where: { id },
      relations: ['longTexts', 'inspecciones', 'avisoMantenimientos']
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.findOne(id);
    if (!item) {
      throw new Error('Item not found');
    }

    // Actualizar relaciones si se proporcionan
    if (updateItemDto.longTexts) {
      const longText = this.longTextRepository.create(updateItemDto.longTexts);
      const savedLongText = await this.longTextRepository.save(longText);
      item.longTexts = savedLongText;
    }
    
    if (updateItemDto.inspecciones) {
      const inspeccion = this.inspeccionRepository.create(updateItemDto.inspecciones);
      const savedInspeccion = await this.inspeccionRepository.save(inspeccion);
      item.inspecciones = savedInspeccion;
    }

    // Manejar inspecciones existentes por ID si se proporcionan
    if (updateItemDto.inspeccionIds && updateItemDto.inspeccionIds.length > 0) {
      const existingInspecciones = await this.inspeccionRepository.find({
        where: { id: In(updateItemDto.inspeccionIds) }
      });
      item.inspecciones = existingInspecciones;
    }
    
    if (updateItemDto.avisoMantenimientoIds) {
      item.avisoMantenimientos = await this.avisoMantenimientoRepository.find({
        where: { id: In(updateItemDto.avisoMantenimientoIds) }
      });
    }

    // Actualizar campos básicos
    if (updateItemDto.SUBCO) item.SUBCO = updateItemDto.SUBCO;

    return await this.itemRepository.save(item);
  }

  async remove(id: number) {
    const result = await this.itemRepository.delete(id);
    return result;
  }

  async createItemsForAvisoMantenimiento(
    inspecciones: { id: number }[], 
    longTexts: { id: number }[]
  ): Promise<Item[]> {
    const items: Item[] = [];
    
    // Crear un item con múltiples inspecciones y longTexts
    const existingItems = await this.itemRepository.find();
    
    const subco = String(existingItems.length + 1).padStart(5, '0');
    
    // Buscar las entidades relacionadas
    const longTextEntities = await this.longTextRepository.find({
      where: { id: In(longTexts.map(lt => lt.id)) }
    });
    const inspeccionEntities = await this.inspeccionRepository.find({
      where: { id: In(inspecciones.map(i => i.id)) }
    });
    
    const item = this.itemRepository.create();
    item.SUBCO = subco;
    item.longTexts = longTextEntities;
    item.inspecciones = inspeccionEntities;
    
    const savedItem = await this.itemRepository.save(item);
    items.push(savedItem);
    
    return items;
  }
}
