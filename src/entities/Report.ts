import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Quiz } from "./Quiz";

@Entity("reports")
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  contents: string;

  @Column({ default: false })
  isPrivate: boolean;

  @Column()
  userId: string;
 
  @Column()
  category: string; // '정답 오류', '부적절한 내용', '기타'

  @Column()
  quizId: number;

  @Column({ nullable: true })
  parentId: number;

  @Column({ default: 1 }) // 1: pending, 2: in-progress, 3: resolved
  stateId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.reports, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Quiz, { onDelete: "CASCADE" })
  @JoinColumn({ name: "quizId" })
  quiz: Quiz;

  @ManyToOne(() => Report, (report) => report.children, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "parentId" })
  parent: Report;

  @OneToMany(() => Report, (report) => report.parent)
  children: Report[];
}
