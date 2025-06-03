import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Item } from '../../items/entities/item.entity';

@Entity('long_text')
export class LongText {
  @PrimaryGeneratedColumn()
  id: number;

   @Column({ type: 'varchar', length: 5 })
  linea: string;
 
  @Column({ type: 'text' })
  textLine: string;

  // Relación ManyToOne con Item
  @ManyToOne(() => Item, (item) => item.longTexts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;
}
