import { z } from 'zod';

export const ReportSchema = z.object({
  id: z.number(),
  title: z.string(),
  contents: z.string(),
  isPrivate: z.boolean(),
  userId: z.string(),
  quizId: z.number(),
  parentId: z.number().optional(),
  stateId: z.number(),
});

export const CreateReportSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  contents: z.string().min(1, '내용은 필수입니다'),
  isPrivate: z.boolean().default(false),
  userId: z.string().min(1, '사용자 ID는 필수입니다'),
  category: z.enum(['정답 오류', '부적절한 내용', '기타']),
  quizId: z.number().min(1, '퀴즈 ID는 필수입니다'),
  parentId: z.number().optional(),
});

export const UpdateReportSchema = CreateReportSchema.partial();

export const ReportParamsSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10)),
});

export const ReportQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val, 10)).default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).default('10'),
  userId: z.string().optional(),
  quizId: z.string().transform(val => parseInt(val, 10)).optional(),
  category: z.enum(['정답 오류', '부적절한 내용', '기타']).optional(),
});

export type ReportType = z.infer<typeof ReportSchema>;
export type CreateReportRequest = z.infer<typeof CreateReportSchema>;
export type UpdateReportRequest = z.infer<typeof UpdateReportSchema>;
export type ReportParams = z.infer<typeof ReportParamsSchema>;
export type ReportQuery = z.infer<typeof ReportQuerySchema>;
