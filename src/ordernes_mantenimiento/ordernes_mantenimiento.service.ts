import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrdernesMantenimientoDto } from './dto/create-ordernes_mantenimiento.dto';
import { OrdernesMantenimiento } from './entities/ordernes_mantenimiento.entity';

@Injectable()
export class OrdernesMantenimientoService {
  constructor(
    @InjectRepository(OrdernesMantenimiento)
    private readonly ordernesMantenimientoRepository: Repository<OrdernesMantenimiento>,
  ) {}

  async create(createOrdernesMantenimientoDto: CreateOrdernesMantenimientoDto): Promise<OrdernesMantenimiento> {
    const ordenMantenimiento = this.ordernesMantenimientoRepository.create({
      ...createOrdernesMantenimientoDto,
      enterDate: createOrdernesMantenimientoDto.enterDate ? new Date(createOrdernesMantenimientoDto.enterDate) : undefined,
    });
    
    return await this.ordernesMantenimientoRepository.save(ordenMantenimiento);
  }

  async findAll(): Promise<OrdernesMantenimiento[]> {
    return await this.ordernesMantenimientoRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async upsertOrdenesMantenimiento(ordenesData: any[]): Promise<{ createdCount: number; updatedCount: number; errorCount: number }> {
    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const orden of ordenesData) {
      try {
        // Buscar si ya existe una orden con el mismo ORDERID
        const existingOrden = await this.ordernesMantenimientoRepository.findOne({
          where: { orderId: orden.ORDERID }
        });

        if (existingOrden) {
          // Actualizar la orden existente
          await this.ordernesMantenimientoRepository.update(
            { orderId: orden.ORDERID },
            {
              orderType: orden.ORDER_TYPE || undefined,
              notifNo: orden.NOTIF_NO || undefined,
              enteredBy: orden.ENTERED_BY || undefined,
              enterDate: orden.ENTER_DATE ? new Date(orden.ENTER_DATE) : undefined,
              changedBy: orden.CHANGED_BY || undefined,
              shortText: orden.SHORT_TEXT || undefined,
              abcIndic: orden.ABCINDIC || undefined,
              priority: orden.PRIORITY || undefined,
              equipment: orden.EQUIPMENT || undefined,
              equiDescr: orden.EQUIDESCR || undefined,
              funcLoc: orden.FUNCLOC || undefined,
              funclDescr: orden.FUNCLDESCR || undefined,
              assembly: orden.ASSEMBLY || undefined,
              planPlant: orden.PLANPLANT || undefined,
              respPlannerGroup: orden.RESP_PLANNER_GROUP || undefined,
              mnWkCtr: orden.MN_WK_CTR || undefined,
              systemResp: orden.SYSTEM_RESP || undefined,
              maintPlan: orden.MAINTPLAN || undefined,
              workCntr: orden.WORK_CNTR || undefined,
              pmactType: orden.PMACTTYPE || undefined,
              startPoint: orden.START_POINT || undefined,
              endPoint: orden.END_POINT || undefined,
              linearLength: orden.LINEAR_LENGTH ? parseFloat(orden.LINEAR_LENGTH) : undefined,
              linearUnit: orden.LINEAR_UNIT || undefined,
            }
          );
          updatedCount++;
        } else {
          // Crear nueva orden
          const nuevaOrden = this.ordernesMantenimientoRepository.create({
            orderId: orden.ORDERID,
            orderType: orden.ORDER_TYPE || undefined,
            notifNo: orden.NOTIF_NO || undefined,
            enteredBy: orden.ENTERED_BY || undefined,
            enterDate: orden.ENTER_DATE ? new Date(orden.ENTER_DATE) : undefined,
            changedBy: orden.CHANGED_BY || undefined,
            shortText: orden.SHORT_TEXT || undefined,
            abcIndic: orden.ABCINDIC || undefined,
            priority: orden.PRIORITY || undefined,
            equipment: orden.EQUIPMENT || undefined,
            equiDescr: orden.EQUIDESCR || undefined,
            funcLoc: orden.FUNCLOC || undefined,
            funclDescr: orden.FUNCLDESCR || undefined,
            assembly: orden.ASSEMBLY || undefined,
            planPlant: orden.PLANPLANT || undefined,
            respPlannerGroup: orden.RESP_PLANNER_GROUP || undefined,
            mnWkCtr: orden.MN_WK_CTR || undefined,
            systemResp: orden.SYSTEM_RESP || undefined,
            maintPlan: orden.MAINTPLAN || undefined,
            workCntr: orden.WORK_CNTR || undefined,
            pmactType: orden.PMACTTYPE || undefined,
            startPoint: orden.START_POINT || undefined,
            endPoint: orden.END_POINT || undefined,
            linearLength: orden.LINEAR_LENGTH ? parseFloat(orden.LINEAR_LENGTH) : undefined,
            linearUnit: orden.LINEAR_UNIT || undefined,
          });

          await this.ordernesMantenimientoRepository.save(nuevaOrden);
          createdCount++;
        }
      } catch (error) {
        console.error(`Error processing orden ${orden.ORDERID}:`, error);
        errorCount++;
      }
    }

    return { createdCount, updatedCount, errorCount };
  }
}
