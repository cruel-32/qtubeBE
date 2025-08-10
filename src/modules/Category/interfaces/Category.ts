import { z } from 'zod'

export const CreateCategorySchema = z.object({
  name: z.string().min(1, '카테고리 이름은 필수입니다'),
  parentId: z.number().int().positive().optional(),
})

export const UpdateCategorySchema = CreateCategorySchema.partial()

export const CategoryParamsSchema = z.object({
  id: z.string().transform(val => parseInt(val, 10)),
})

export type CreateCategoryRequest = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryRequest = z.infer<typeof UpdateCategorySchema>
export type CategoryParams = z.infer<typeof CategoryParamsSchema>