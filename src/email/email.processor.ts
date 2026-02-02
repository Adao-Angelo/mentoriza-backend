import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { EmailService } from './email.service';
import { EmailPayload } from './email.types';

@Processor('email')
export class EmailProcessor {
  private logger = new Logger(EmailProcessor.name);

  constructor(private emailService: EmailService) {}

  @Process('send-email')
  async handleSendEmail(job: Job<EmailPayload>) {
    try {
      this.logger.log(`Processing email job ${job.id} for ${job.data.to}`);
      await this.emailService.sendEmail(job.data);
      this.logger.log(`Email job ${job.id} completed successfully`);
    } catch (error) {
      this.logger.error(`Email job ${job.id} failed:`, error);
      throw error;
    }
  }
}
