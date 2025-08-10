import { z } from 'zod';

export const AcquireBadgeSchema = z.object({
  badgeId: z.number(),
});

export type AcquireBadgeInput = z.infer<typeof AcquireBadgeSchema>;
