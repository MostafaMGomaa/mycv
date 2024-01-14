import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  etc: string;

  @Column()
  mileage: number;

  @Column()
  price: number;

  @Column()
  type: string;
}
