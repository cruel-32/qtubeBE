import { FastifyRequest, FastifyReply } from 'fastify'
import { IsNull } from 'typeorm'
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryParams,
} from '@/modules/Category/interfaces/Category'
import { convertNullToUndefined } from '@/utils/dbValueConverter'
export class CategoryController {
  static async createCategory(
    request: FastifyRequest<{ Body: CreateCategoryRequest }>,
    reply: FastifyReply
  ) {
    try {
      const category = request.server.repositories.category.create(request.body)
      const savedCategory = await request.server.repositories.category.save(category)
      
      reply.status(201).send({
        success: true,
        data: {
          ...savedCategory,
          parentId: convertNullToUndefined(savedCategory.parentId),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to create category',
      })
    }
  }

  static async getAllCategories(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const categories = await request.server.repositories.category.find({
        relations: ['parent', 'children'],
      })

      reply.status(200).send({
        success: true,
        data: categories.map((category) => ({
          ...category,
          parentId: convertNullToUndefined(category.parentId),
        })),
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get categories',
      })
    }
  }

  static async getRootCategories(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const categories = await request.server.repositories.category.find({
        where: { parentId: IsNull() },
      })

      reply.status(200).send({
        success: true,
        data: categories.map((category) => ({
          ...category,
          parentId: convertNullToUndefined(category.parentId),
        })),
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get root categories',
      })
    }
  }

  static async getCategoryChildren(
    request: FastifyRequest<{ Params: CategoryParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const category = await request.server.repositories.category.findOne({
        where: { id },
        relations: ['children'],
      })

      if (!category) {
        reply.status(404).send({
          success: false,
          error: 'Category not found',
        })
        return
      }

      reply.status(200).send({
        success: true,
        data: category.children.map((child) => ({
          ...child,
          parentId: convertNullToUndefined(child.parentId),
        })),
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get category children',
      })
    }
  }

  static async getCategoryById(
    request: FastifyRequest<{ Params: CategoryParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const category = await request.server.repositories.category.findOne({
        where: { id },
        relations: ['parent', 'children'],
      })

      if (!category) {
        reply.status(404).send({
          success: false,
          error: 'Category not found',
        })
        return
      }

      reply.status(200).send({
        success: true,
        data: {
          ...category,
          parentId: convertNullToUndefined(category.parentId),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to get category',
      })
    }
  }

  static async updateCategory(
    request: FastifyRequest<{ Params: CategoryParams; Body: UpdateCategoryRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const category = await request.server.repositories.category.findOne({
        where: { id },
      })

      if (!category) {
        reply.status(404).send({
          success: false,
          error: 'Category not found',
        })
        return
      }

      await request.server.repositories.category.update(id, request.body)
      
      const updatedCategory = await request.server.repositories.category.findOne({
        where: { id },
      })

      if (!updatedCategory) {
        reply.status(404).send({
          success: false,
          error: 'Category not found',
        })
        return
      }

      reply.status(200).send({
        success: true,
        data: {
          ...updatedCategory,
          parentId: convertNullToUndefined(updatedCategory.parentId),
        },
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to update category',
      })
    }
  }

  static async deleteCategory(
    request: FastifyRequest<{ Params: CategoryParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      
      const category = await request.server.repositories.category.findOne({
        where: { id },
      })

      if (!category) {
        reply.status(404).send({
          success: false,
          error: 'Category not found',
        })
        return
      }

      await request.server.repositories.category.remove(category)

      reply.status(200).send({
        success: true,
        message: 'Category deleted successfully',
      })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({
        success: false,
        error: 'Failed to delete category',
      })
    }
  }
}