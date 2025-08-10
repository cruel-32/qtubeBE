import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Badge } from './Badge';

@Entity('user_badges')
export class UserBadge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  badgeId: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, user => user.userBadges)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Badge, badge => badge.userBadges)
  @JoinColumn({ name: 'badgeId' })
  badge: Badge;
}
