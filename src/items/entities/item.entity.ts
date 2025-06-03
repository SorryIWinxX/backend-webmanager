import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, OneToMany, JoinTable, JoinColumn } from 'typeorm';
import { LongText } from '../../long_text/entities/long_text.entity';
import { Inspeccion } from '../../inspeccion/entities/inspeccion.entity';
import { AvisoMantenimiento } from '../../avisos_mantenimiento/entities/aviso-mantenimiento.entity';

@Entity('item')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 5, comment: 'Subconsecutivo - Se incrementa según inspecciones y long_text', nullable: true })
  SUBCO?: string

  // Relación OneToMany con LongText (cada item puede tener múltiples longTexts)
  @OneToMany(() => LongText, (longText) => longText.item, { eager: true, cascade: true })
  longTexts?: LongText[];

  // Relación ManyToMany con Inspeccion (cada item puede tener múltiples inspecciones)
  @ManyToMany(() => Inspeccion, { eager: true })
  @JoinTable({
    name: 'item_inspeccion',
    joinColumn: {
      name: 'item_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'inspeccion_id',
      referencedColumnName: 'id'
    }
  })
  inspecciones?: Inspeccion[];

  // Relación ManyToMany con AvisoMantenimiento
  @ManyToMany(() => AvisoMantenimiento, (avisoMantenimiento) => avisoMantenimiento.items, {
    eager: true,
  })
  @JoinTable({
    name: 'item_aviso_mantenimiento',
    joinColumn: {
      name: 'item_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'aviso_mantenimiento_id',
      referencedColumnName: 'id'
    }
  })
  avisoMantenimientos: AvisoMantenimiento[];
}
