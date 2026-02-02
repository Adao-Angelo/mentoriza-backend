import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    description: 'Group ID that this report belongs to',
    example: 1,
  })
  @IsInt()
  groupId: number;

  @ApiProperty({
    description: 'Submission ID that this report is associated with',
    example: 1,
  })
  @IsInt()
  submissionId: number;

  @ApiProperty({
    description: 'File URL from Cloudinary',
    example: 'https://res.cloudinary.com/...',
  })
  @IsString()
  fileUrl: string;

  @ApiProperty({
    description: 'Public ID from Cloudinary (for deletion)',
    example: 'mentoriza/reports/abc123',
    required: false,
  })
  @IsOptional()
  @IsString()
  publicId?: string;

  @ApiProperty({
    description: 'Score given by the AI evaluation',
    example: 8.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiProperty({
    description: 'Observations from the AI evaluation',
    example: 'Good structure but needs more citations',
    required: false,
  })
  @IsOptional()
  @IsString()
  observations?: string;
}
