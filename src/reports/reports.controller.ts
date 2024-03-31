import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';

import { CreateReportDto, ApproveReportDto, ReportDto } from './dtos';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decoratros/current-user.decorator';
import { User } from '../users/users.entity';
import { Serialize } from '../interceptors';
@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @Patch('/:id')
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportService.changeApproval(parseInt(id), body.approved);
  }
}
