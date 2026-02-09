import { Injectable, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ReportStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportsService } from './reports.service';

export const REPORT_RESULTS_EVENT = 'report.evaluation.completed';

@Injectable()
export class ReportProcessor {
  private readonly logger = new Logger(ReportProcessor.name);

  constructor(
    private readonly reportsService: ReportsService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Handler para consumir mensagens da fila 'report_results'.
   *
   * - Usa @EventPattern para escutar eventos (fire-and-forget, sem resposta obrigatória).
   * - Recebe o payload bruto (@Payload) e o contexto RabbitMQ (@Ctx) para ack/nack manual.
   * - Atualiza o relatório no banco com os resultados da análise (score, status, etc.).
   * - Em caso de erro, faz nack com requeue para tentar novamente.
   */
  @EventPattern(REPORT_RESULTS_EVENT)
  async handleReportResults(
    @Payload()
    data: {
      report_id: number;
      group_id: number;
      keyResults: Record<string, number>;
      observations: string[];
      score: number;
      status: ReportStatus;
      processed_at: string;
    },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(
        `Resultado de análise recebido para relatório ID ${data.report_id} (grupo ${data.group_id})`,
      );

      await this.prisma.report.update({
        where: { id: data.report_id },
        data: {
          score: data.score,
          status: data.status,
          keyResults: JSON.stringify(data.keyResults),
          observations: data.observations.join('; '),
          analyzedAt: new Date(),
        },
      });

      this.logger.log(
        `Relatório ${data.report_id} atualizado com sucesso no banco.`,
      );

      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(
        `Erro ao salvar resultado do relatório ${data?.report_id ?? 'desconhecido'}: ${error.message}`,
        error.stack,
      );

      channel.nack(originalMsg, false, true);
    }
  }
}
