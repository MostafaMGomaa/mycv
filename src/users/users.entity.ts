import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/reports.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Insert user with id : ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated User with id : `, this.id);
  }

  @BeforeRemove()
  logRemove() {
    console.log(`Removed User with id : `, this.id);
  }
}
