import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus } from '@prisma/client';

export class ReportResponseDto {
  @ApiProperty({
    description: 'Report unique identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Group ID that this report belongs to',
    example: 1,
  })
  groupId: number;

  @ApiProperty({
    description: 'Submission ID that this report is associated with',
    example: 1,
  })
  submissionId: number;

  @ApiProperty({
    description: 'File URL from Cloudinary',
    example: 'https://res.cloudinary.com/...',
  })
  fileUrl: string;

  @ApiProperty({
    description: 'Public ID from Cloudinary',
    example: 'mentoriza/reports/abc123',
    required: false,
  })
  publicId?: string;

  @ApiProperty({
    description: 'Report status',
    enum: ['under_review', 'approved', 'rejected'],
    example: 'under_review',
  })
  status: ReportStatus;

  @ApiProperty({
    description: 'Score given by the AI evaluation',
    example: 8.5,
    required: false,
  })
  score?: number;

  @ApiProperty({
    description: 'Observations from the AI evaluation',
    example: 'Good structure but needs more citations',
    required: false,
  })
  observations?: string;

  @ApiProperty({
    description: 'Key results from AI analysis',
    example: {
      aiContent: 15,
      abntCompliance: 85,
      plagiarism: 2,
    },
    required: false,
  })
  keyResults?: Record<string, unknown>;

  @ApiProperty({
    description: 'Report creation date',
    example: '2026-02-02T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Report last update date',
    example: '2026-02-02T10:00:00Z',
  })
  updatedAt: Date;
}
