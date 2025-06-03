import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ordernes_mantenimiento')
export class OrdernesMantenimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', length: 50 })
  orderId: string;

  @Column({ name: 'order_type', length: 10, nullable: true })
  orderType: string;

  @Column({ name: 'notif_no', length: 50, nullable: true })
  notifNo: string;

  @Column({ name: 'entered_by', length: 50, nullable: true })
  enteredBy: string;

  @Column({ name: 'enter_date', type: 'date', nullable: true })
  enterDate: Date;

  @Column({ name: 'changed_by', length: 50, nullable: true })
  changedBy: string;

  @Column({ name: 'short_text', length: 255, nullable: true })
  shortText: string;

  @Column({ name: 'abc_indic', length: 10, nullable: true })
  abcIndic: string;

  @Column({ name: 'priority', length: 10, nullable: true })
  priority: string;

  @Column({ name: 'equipment', length: 50, nullable: true })
  equipment: string;

  @Column({ name: 'equi_descr', length: 255, nullable: true })
  equiDescr: string;

  @Column({ name: 'func_loc', length: 50, nullable: true })
  funcLoc: string;

  @Column({ name: 'funcl_descr', length: 255, nullable: true })
  funclDescr: string;

  @Column({ name: 'assembly', length: 50, nullable: true })
  assembly: string;

  @Column({ name: 'plan_plant', length: 10, nullable: true })
  planPlant: string;

  @Column({ name: 'resp_planner_group', length: 50, nullable: true })
  respPlannerGroup: string;

  @Column({ name: 'mn_wk_ctr', length: 50, nullable: true })
  mnWkCtr: string;

  @Column({ name: 'system_resp', length: 50, nullable: true })
  systemResp: string;

  @Column({ name: 'maint_plan', length: 50, nullable: true })
  maintPlan: string;

  @Column({ name: 'work_cntr', length: 50, nullable: true })
  workCntr: string;

  @Column({ name: 'pmact_type', length: 10, nullable: true })
  pmactType: string;

  @Column({ name: 'start_point', length: 50, nullable: true })
  startPoint: string;

  @Column({ name: 'end_point', length: 50, nullable: true })
  endPoint: string;

  @Column({ name: 'linear_length', type: 'decimal', precision: 10, scale: 3, nullable: true })
  linearLength: number;

  @Column({ name: 'linear_unit', length: 10, nullable: true })
  linearUnit: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
