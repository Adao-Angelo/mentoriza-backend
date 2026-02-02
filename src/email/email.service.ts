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
    // Configure based on your email provider
    const emailUser = this.configService.get('EMAIL_USER');
    const emailPassword = this.configService.get('EMAIL_PASSWORD');
    const emailHost = this.configService.get('EMAIL_HOST', 'smtp.gmail.com');
    const emailPort = this.configService.get('EMAIL_PORT', 587);

    this.transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailPort === 465,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
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

      this.logger.log(`Email sent successfully to ${payload.to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${payload.to}: ${error.message}`,
      );
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
        throw new Error(`Unknown email type: ${type as string}`);
    }
  }
}
