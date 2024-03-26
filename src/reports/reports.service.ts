import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Report } from './reports.entity';
import { CreateReportDto } from './dtos';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(data: CreateReportDto) {
    const report = this.repo.create(data);

    return this.repo.save(report);
  }
}
