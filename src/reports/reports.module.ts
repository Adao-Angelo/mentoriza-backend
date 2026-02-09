import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailModule } from 'src/email/email.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportQueueService } from './report-queue.service';
import { ReportProcessor } from './report.processor';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    EmailModule,
    ConfigModule,
    ClientsModule.register([
      {
        name: 'REPORT_PROCESSING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL || ''],
          queue: 'report_processing',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [ReportsController],
  providers: [
    ReportsService,
    PrismaService,
    ReportQueueService,
    ReportProcessor,
  ],
  exports: [ReportsService, ReportQueueService],
})
export class ReportsModule {}
