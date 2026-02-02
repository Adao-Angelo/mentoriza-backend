import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { CreateSubmissionDto } from './create-submission.dto';

export class UpdateSubmissionDto extends PartialType(CreateSubmissionDto) {
  @ApiPropertyOptional({
    description: 'Novo status da submissão',
    enum: ['active', 'inactive'],
    example: 'inactive',
  })
  @IsOptional()
  @IsIn(['active', 'inactive'], {
    message: 'status deve ser "active" ou "inactive"',
  })
  status?: 'active' | 'inactive';

  @ApiPropertyOptional({
    description: 'Nova data de término (ISO 8601)',
    example: '2025-04-30T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Nova etapa/fase',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  stage?: number;
}
