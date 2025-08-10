import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Answer } from "./Answer";

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column({ nullable: true })
  answer1: string;

  @Column({ nullable: true })
  answer2: string;

  @Column({ nullable: true })
  answer3: string;

  @Column({ nullable: true })
  answer4: string;

  @Column()
  correct: string;

  @Column()
  type: number;

  @Column({ default: 0 })
  correctCount: number;

  @Column({ default: 0 })
  wrongCount: number;

  @Column()
  categoryId: number;

  @Column({ default: 'D' })
  difficulty: string;

  @Column({ nullable: true })
  explanation: string;

  @OneToMany(() => Answer, answer => answer.quiz)
  answers: Answer[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}