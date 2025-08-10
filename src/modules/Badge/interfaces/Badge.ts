import { z } from 'zod';

export const CreateBadgeSchema = z.object({
  name: z.string(),
  description: z.string(),
  imageUrl: z.string().url(),
  type: z.string(),
  condition: z.string(), // JSON string
  grade: z.string(),
});

export const UpdateBadgeSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  type: z.string().optional(),
  condition: z.string().optional(),
  grade: z.string().optional(),
});

export const GetBadgesQuerySchema = z.object({
  categoryIds: z.string().optional().transform((val) => val ? val.split(',') : []),
});

export type CreateBadgeInput = z.infer<typeof CreateBadgeSchema>;
export type UpdateBadgeInput = z.infer<typeof UpdateBadgeSchema>;
export type GetBadgesQuery = z.infer<typeof GetBadgesQuerySchema>;
