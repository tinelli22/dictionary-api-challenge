import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'word' })
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
