import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailQueueService } from './email-queue.service';
import { EmailProcessor } from './email.processor';
import { EmailService } from './email.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
    ConfigModule,
  ],
  providers: [EmailService, EmailProcessor, EmailQueueService],
  exports: [EmailQueueService],
})
export class EmailModule {}
