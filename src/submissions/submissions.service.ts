import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSubmissionDto) {
    return await this.prisma.submission.create({
      data: {
        endDate: new Date(dto.endDate),
        stage: dto.stage,
        status: 'active',
      },
    });
  }

  async update(id: number, dto: UpdateSubmissionDto) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException(`Submissão com ID ${id} não encontrada`);
    }

    if (dto.endDate) {
      const newEndDate = new Date(dto.endDate);
      if (newEndDate <= new Date()) {
        throw new BadRequestException('Data de término deve ser no futuro');
      }
    }

    return this.prisma.submission.update({
      where: { id },
      data: {
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        stage: dto.stage,
        status: dto.status,
      },
    });
  }

  async getActiveSubmission() {
    const now = new Date();

    // Aqui usamos await para satisfazer o lint
    const active = await this.prisma.submission.findFirst({
      where: {
        status: 'active',
        endDate: {
          gt: now,
        },
      },
      orderBy: {
        stage: 'asc',
      },
    });

    return active;
  }

  async findAll() {
    // Aqui também usamos await
    const submissions = await this.prisma.submission.findMany({
      orderBy: [{ stage: 'asc' }, { createdAt: 'desc' }],
    });

    return submissions;
  }

  async findOne(id: number) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException(`Submissão com ID ${id} não encontrada`);
    }

    return submission;
  }

  async remove(id: number) {
    await this.findOne(id); // valida existência

    return this.prisma.submission.delete({
      where: { id },
    });
  }
}
