import "reflect-metadata";
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Answer } from "./Answer";
import { Report } from "./Report";
import { RankingScore } from "./RankingScore";
import { UserBadge } from "./UserBadge";

export enum Platform {
  GOOGLE = "google",
  NAVER = "naver",
  KAKAO = "kakao",
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  nickName: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  picture?: string;

  @Column({
    type: "enum",
    enum: Platform,
  })
  platform: Platform;

  @Column()
  email: string;

  @Column({ nullable: true })
  profile: string;

  @Column({ nullable: true })
  introduction: string;

  @Column({ nullable: true })
  profileImage: string;

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @OneToMany(() => RankingScore, (rankingScore) => rankingScore.user)
  rankingScores: RankingScore[];

  @OneToMany(() => UserBadge, userBadge => userBadge.user)
  userBadges: UserBadge[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ nullable: true })
  fcmToken: string;

  @Column({ default: true })
  pushNotificationsEnabled: boolean;
}