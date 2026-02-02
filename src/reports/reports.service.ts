import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ReportStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(createReportDto: CreateReportDto) {
    // Verify submission exists and is active
    const submission = await this.prisma.submission.findUnique({
      where: { id: createReportDto.submissionId },
    });

    if (!submission) {
      throw new NotFoundException(
        `Submission with ID ${createReportDto.submissionId} not found`,
      );
    }

    if (submission.status !== 'active') {
      throw new BadRequestException(
        `Cannot upload report for inactive submission`,
      );
    }

    // Verify group exists
    const group = await this.prisma.group.findUnique({
      where: { id: createReportDto.groupId },
    });

    if (!group) {
      throw new NotFoundException(
        `Group with ID ${createReportDto.groupId} not found`,
      );
    }

    return this.prisma.report.create({
      data: {
        groupId: createReportDto.groupId,
        submissionId: createReportDto.submissionId,
        fileUrl: createReportDto.fileUrl,
        publicId: createReportDto.publicId,
        score: createReportDto.score,
        observations: createReportDto.observations,
        status: 'under_review' as ReportStatus,
      },
      include: {
        submission: true,
        group: true,
      },
    });
  }

  async findAll() {
    return this.prisma.report.findMany({
      include: {
        submission: true,
        group: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        submission: true,
        group: true,
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  async findBySubmission(submissionId: number) {
    return this.prisma.report.findMany({
      where: { submissionId },
      include: {
        group: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByGroup(groupId: number) {
    return this.prisma.report.findMany({
      where: { groupId },
      include: {
        submission: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    // Prevent changing submission or group after creation
    const updateData = { ...updateReportDto };
    delete (updateData as any).submissionId;
    delete (updateData as any).groupId;

    return this.prisma.report.update({
      where: { id },
      data: updateData,
      include: {
        submission: true,
        group: true,
      },
    });
  }

  async updateStatus(id: number, status: ReportStatus) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return this.prisma.report.update({
      where: { id },
      data: { status },
      include: {
        submission: true,
        group: true,
      },
    });
  }

  async updateWithAIResults(
    id: number,
    score: number,
    observations: string,
    keyResults: Record<string, unknown>,
  ) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return this.prisma.report.update({
      where: { id },
      data: {
        score,
        observations,
        keyResults: keyResults as Prisma.InputJsonValue,
        status: 'under_review' as ReportStatus,
      },
      include: {
        submission: true,
        group: true,
      },
    });
  }

  async remove(id: number) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return this.prisma.report.delete({
      where: { id },
    });
  }
}
