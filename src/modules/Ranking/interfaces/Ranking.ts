import { z } from 'zod';

export const RankingSchema = z.object({
  rank: z.number().nullable().optional(),
  score: z.number().default(0),
  totalAttempts: z.number().default(0),
  correctAnswers: z.number().default(0),
  accuracy: z.number().default(0),
  user: z.object({
    id: z.string(),
    nickName: z.string().nullable().optional(),
    picture: z.string().nullable().optional(),
  }),
});

export const RankingResponseSchema = z.object({
  success: z.boolean(),
  data: RankingSchema,
});

export const RankingListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(RankingSchema),
});

export type Ranking = z.infer<typeof RankingSchema>;
export type RankingResponse = z.infer<typeof RankingResponseSchema>;
export type RankingListResponse = z.infer<typeof RankingListResponseSchema>;

export const DailyRankingQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식은 YYYY-MM-DD여야 합니다.').optional(),
});

export type DailyRankingQuery = z.infer<typeof DailyRankingQuerySchema>;

export const WeeklyRankingQuerySchema = z.object({
  wYear: z.string().transform(Number).optional(),
  week: z.string().transform(Number).optional(),
  current: z.string().optional(), // 'true'일 때 현재 주 조회
});

export type WeeklyRankingQuery = z.infer<typeof WeeklyRankingQuerySchema>;

export const MonthlyRankingQuerySchema = z.object({
  mYear: z.string().transform(Number).optional(),
  month: z.string().transform(Number).optional(),
  current: z.string().optional(), // 'true'일 때 현재 월 조회
});

export type MonthlyRankingQuery = z.infer<typeof MonthlyRankingQuerySchema>;