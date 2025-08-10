import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Quiz } from "./Quiz";

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  quizId: number;

  @Column()
  categoryId: number;

  @Column()
  userAnswer: string;

  @Column()
  isCorrect: boolean;

  @Column({ default: 0 })
  point: number;

  @Column({ default: 0 })
  bonusPoint: number;

  @Column({ nullable: true })
  timeTaken: number;

  @ManyToOne(() => User, (user) => user.answers)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Quiz)
  @JoinColumn({ name: "quizId" })
  quiz: Quiz;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}