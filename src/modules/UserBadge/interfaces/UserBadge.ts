import { z } from 'zod';

export const AcquireBadgeSchema = z.object({
  badgeId: z.number(),
});

export const UpdateEquippedBadgesSchema = z.object({
  badgeIds: z.array(z.number()),
});

export type AcquireBadgeInput = z.infer<typeof AcquireBadgeSchema>;
export type UpdateEquippedBadgesInput = z.infer<typeof UpdateEquippedBadgesSchema>;
