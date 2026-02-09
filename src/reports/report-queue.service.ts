import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  REPORT_EVALUATION_EVENT,
  ReportEvaluationEvent,
} from 'src/common/events/report/report-evaluation.event';

/**
 * Serviço responsável por enfileirar tarefas de análise de relatórios no RabbitMQ.
 */
@Injectable()
export class ReportQueueService {
  private readonly logger = new Logger(ReportQueueService.name);

  constructor(
    @Inject('REPORT_PROCESSING_SERVICE') private readonly client: ClientProxy,
  ) {}

  /**
   * Enfileira um relatório para análise assíncrona pelo worker.
   *
   * @param data Payload com informações do relatório e indicadores ativos
   */
  async enqueueReportEvaluation(data: ReportEvaluationEvent): Promise<void> {
    try {
      await this.client.emit(REPORT_EVALUATION_EVENT, data).toPromise();
      this.logger.log(
        `Evento emitido para RabbitMQ: relatório #${data.reportId} (grupo ${data.groupId})`,
      );
    } catch (error) {
      this.logger.error(`Falha ao emitir evento: ${error.message}`);
      throw error;
    }
  }
}
