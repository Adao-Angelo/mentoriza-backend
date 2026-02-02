import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportStatus } from '@prisma/client';

import { CreateReportDto } from './dto/create-report.dto';
import { ReportResponseDto } from './dto/submission-response.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({
    status: 201,
    description: 'Report created successfully.',
    type: ReportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or inactive submission.',
  })
  @ApiResponse({ status: 404, description: 'Submission or group not found.' })
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all reports' })
  @ApiResponse({
    status: 200,
    description: 'List of all reports.',
    type: [ReportResponseDto],
  })
  findAll() {
    return this.reportsService.findAll();
  }

  @Get('submission/:submissionId')
  @ApiOperation({ summary: 'Get all reports for a submission' })
  @ApiResponse({
    status: 200,
    description: 'List of reports for the submission.',
    type: [ReportResponseDto],
  })
  findBySubmission(@Param('submissionId') submissionId: string) {
    return this.reportsService.findBySubmission(+submissionId);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get all reports for a group' })
  @ApiResponse({
    status: 200,
    description: 'List of reports for the group.',
    type: [ReportResponseDto],
  })
  findByGroup(@Param('groupId') groupId: string) {
    return this.reportsService.findByGroup(+groupId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report by ID' })
  @ApiResponse({
    status: 200,
    description: 'Report found.',
    type: ReportResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a report' })
  @ApiResponse({
    status: 200,
    description: 'Report updated successfully.',
    type: ReportResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update report status' })
  @ApiResponse({
    status: 200,
    description: 'Report status updated successfully.',
    type: ReportResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.reportsService.updateStatus(+id, body.status as ReportStatus);
  }

  @Patch(':id/ai-results')
  @ApiOperation({ summary: 'Update report with AI evaluation results' })
  @ApiResponse({
    status: 200,
    description: 'Report updated with AI results.',
    type: ReportResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  updateWithAIResults(
    @Param('id') id: string,
    @Body()
    body: {
      score: number;
      observations: string;
      keyResults: Record<string, unknown>;
    },
  ) {
    return this.reportsService.updateWithAIResults(
      +id,
      body.score,
      body.observations,
      body.keyResults,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report' })
  @ApiResponse({ status: 200, description: 'Report deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
