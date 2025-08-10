import { FastifyInstance } from 'fastify'
import { CategoryController } from '@/modules/Category/controllers/CategoryController'
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  CategoryParamsSchema,
} from '@/modules/Category/interfaces/Category'

const categoryRoutes = async (fastify: FastifyInstance) => {
  // 카테고리 생성
  fastify.post('/', {
    schema: {
      body: CreateCategorySchema,
      tags: ['Category'],
      description: '새로운 카테고리를 생성합니다',
    },
    handler: CategoryController.createCategory,
  })

  // 전체 카테고리 조회
  fastify.get('/', {
    schema: {
      tags: ['Category'],
      description: '모든 카테고리를 조회합니다 (계층 구조 포함)',
    },
    handler: CategoryController.getAllCategories,
  })

  // 최상위 카테고리 조회
  fastify.get('/root', {
    schema: {
      tags: ['Category'],
      description: '최상위 카테고리들을 조회합니다',
    },
    handler: CategoryController.getRootCategories,
  })

  // 카테고리 하위 카테고리 조회
  fastify.get('/:id/children', {
    schema: {
      params: CategoryParamsSchema,
      tags: ['Category'],
      description: '특정 카테고리의 하위 카테고리들을 조회합니다',
    },
    handler: CategoryController.getCategoryChildren,
  })

  // 카테고리 상세 조회
  fastify.get('/:id', {
    schema: {
      params: CategoryParamsSchema,
      tags: ['Category'],
      description: '특정 카테고리의 상세 정보를 조회합니다',
    },
    handler: CategoryController.getCategoryById,
  })

  // 카테고리 업데이트
  fastify.put('/:id', {
    schema: {
      params: CategoryParamsSchema,
      body: UpdateCategorySchema,
      tags: ['Category'],
      description: '카테고리 정보를 업데이트합니다',
    },
    handler: CategoryController.updateCategory,
  })

  // 카테고리 삭제
  fastify.delete('/:id', {
    schema: {
      params: CategoryParamsSchema,
      tags: ['Category'],
      description: '카테고리를 삭제합니다',
    },
    handler: CategoryController.deleteCategory,
  })
}

export default categoryRoutes