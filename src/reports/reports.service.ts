import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Report } from './reports.entity';
import { CreateReportDto } from './dtos';
import { User } from '../users/users.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(data: CreateReportDto, user: User) {
    const report = this.repo.create(data);
    report.user = user;

    return this.repo.save(report);
  }
}
