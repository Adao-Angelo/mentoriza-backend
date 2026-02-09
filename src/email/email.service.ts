import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailPayload, EmailType } from './email.types';
import { generateGroupPublishedTemplate } from './templates/group-published.template';
import { generateReportApprovedTemplate } from './templates/report-approved.template';
import { generateReportRejectedTemplate } from './templates/report-rejected.template';
import { generateReportUnderReviewTemplate } from './templates/report-under-review.template';
import { generateSubmissionActiveTemplate } from './templates/submission-active.template';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = this.configService.get<string>(
      'EMAIL_HOST',
      'live.smtp.mailtrap.io',
    );
    const port = Number(this.configService.get<string>('EMAIL_PORT', '587'));
    const user = this.configService.get<string>('EMAIL_USER', 'api');
    const pass = this.configService.get<string>('EMAIL_PASSWORD');

    if (!user || !pass) {
      this.logger.error(
        'Credenciais SMTP não configuradas corretamente (EMAIL_USER ou EMAIL_PASSWORD ausentes)',
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },

      debug: true,
      logger: true,
    });

    this.transporter.verify((error) => {
      if (error) {
        this.logger.error(
          'Falha ao conectar ao servidor SMTP (Mailtrap):',
          error.message,
        );
        this.logger.error(
          'Possíveis causas: credenciais erradas, porta bloqueada, token expirado',
        );
      } else {
        this.logger.log(
          `Conexão SMTP estabelecida com sucesso! (${host}:${port})`,
        );
      }
    });
  }

  async sendEmail(payload: EmailPayload): Promise<void> {
    try {
      const html = this.getTemplate(payload.type, payload.data);

      await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM', 'noreply@mentoriza.com'),
        to: payload.to,
        subject: payload.subject,
        html,
      });

      this.logger.log(`Email enviado com sucesso para ${payload.to}`);
    } catch (error) {
      this.logger.error(
        `Falha ao enviar email para ${payload.to}: ${error.message}`,
      );
      if (error.code) this.logger.error(`Código do erro: ${error.code}`);
      throw error;
    }
  }

  private getTemplate(type: EmailType, data: any): string {
    switch (type) {
      case EmailType.GROUP_PUBLISHED:
        return generateGroupPublishedTemplate(data);
      case EmailType.REPORT_APPROVED:
        return generateReportApprovedTemplate(data);
      case EmailType.REPORT_REJECTED:
        return generateReportRejectedTemplate(data);
      case EmailType.REPORT_UNDER_REVIEW:
        return generateReportUnderReviewTemplate(data);
      case EmailType.SUBMISSION_ACTIVE:
        return generateSubmissionActiveTemplate(data);
      default:
        throw new Error(`Tipo de email desconhecido: ${type as string}`);
    }
  }
}
