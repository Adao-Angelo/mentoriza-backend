import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import type { Queue } from 'bull';
import {
  EmailPayload,
  EmailType,
  GroupPublishedEmailData,
} from './email.types';

@Injectable()
export class EmailQueueService {
  private logger = new Logger(EmailQueueService.name);

  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async sendGroupPublishedEmail(data: GroupPublishedEmailData): Promise<void> {
    const payload: EmailPayload = {
      type: EmailType.GROUP_PUBLISHED,
      to: data.email,
      subject: `Bem-vindo ao Mentoriza! Seu grupo foi publicado`,
      data,
    };

    await this.emailQueue.add('send-email', payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
    });

    this.logger.log(`Email queued for ${data.email} (GROUP_PUBLISHED)`);
  }

  async sendReportApprovedEmail(
    to: string,
    groupName: string,
    score: number,
    submissionName: string,
    observations?: string,
  ): Promise<void> {
    const payload: EmailPayload = {
      type: EmailType.REPORT_APPROVED,
      to,
      subject: `✅ Seu relatório foi aprovado!`,
      data: {
        groupName,
        score,
        submissionName,
        observations,
      },
    };

    await this.emailQueue.add('send-email', payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
    });

    this.logger.log(`Email queued for ${to} (REPORT_APPROVED)`);
  }

  async sendReportRejectedEmail(
    to: string,
    groupName: string,
    score: number,
    submissionName: string,
    reasons: string[],
    observations?: string,
  ): Promise<void> {
    const payload: EmailPayload = {
      type: EmailType.REPORT_REJECTED,
      to,
      subject: `❌ Seu relatório necessita de revisão`,
      data: {
        groupName,
        score,
        submissionName,
        observations,
        reasons,
      },
    };

    await this.emailQueue.add('send-email', payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
    });

    this.logger.log(`Email queued for ${to} (REPORT_REJECTED)`);
  }

  async sendReportUnderReviewEmail(
    to: string,
    groupName: string,
    submissionName: string,
  ): Promise<void> {
    const payload: EmailPayload = {
      type: EmailType.REPORT_UNDER_REVIEW,
      to,
      subject: `🔍 Seu relatório está em avaliação`,
      data: {
        groupName,
        submissionName,
      },
    };

    await this.emailQueue.add('send-email', payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
    });

    this.logger.log(`Email queued for ${to} (REPORT_UNDER_REVIEW)`);
  }

  async sendSubmissionActiveEmail(
    to: string,
    submissionName: string,
    deadlineDate: Date,
    description?: string,
  ): Promise<void> {
    const payload: EmailPayload = {
      type: EmailType.SUBMISSION_ACTIVE,
      to,
      subject: `📤 Nova submissão aberta: ${submissionName}`,
      data: {
        submissionName,
        deadlineDate,
        description,
      },
    };

    await this.emailQueue.add('send-email', payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
    });

    this.logger.log(`Email queued for ${to} (SUBMISSION_ACTIVE)`);
  }

  async sendBulkGroupPublishedEmails(
    studentsData: GroupPublishedEmailData[],
  ): Promise<void> {
    for (const data of studentsData) {
      await this.sendGroupPublishedEmail(data);
    }
    this.logger.log(`${studentsData.length} group published emails queued`);
  }
}
