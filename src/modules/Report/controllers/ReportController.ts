import { FastifyReply, FastifyRequest } from "fastify";
import { CreateReportRequest, UpdateReportRequest, ReportParams, ReportQuery } from "../interfaces/Report";

export class ReportController {
  static async createReport(
    request: FastifyRequest<{ Body: CreateReportRequest }>,
    reply: FastifyReply
  ) {
    try {
      const reportRepository = request.server.repositories.report;
      const report = reportRepository.create(request.body);
      await reportRepository.save(report);
      return reply.code(201).send({
        success: true,
        data: report,
      });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        error: 'Failed to create report',
      });
    }
  }

  static async getAllReports(request: FastifyRequest<{ Querystring: ReportQuery }>, reply: FastifyReply) {
    try {
      const { page, limit, userId, quizId } = request.query;
      const skip = (page - 1) * limit;

      const queryBuilder = request.server.repositories.report.createQueryBuilder('report');

      if (userId) {
        queryBuilder.andWhere('report.userId = :userId', { userId });
      }
      if (quizId) {
        queryBuilder.andWhere('report.quizId = :quizId', { quizId });
      }

      const [reports, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      reply.status(200).send({
        success: true,
        data: {
          reports,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        error: 'Failed to get reports',
      });
    }
  }

  static async getReportById(
    request: FastifyRequest<{ Params: ReportParams }>,
    reply: FastifyReply
  ) {
    try {
      const reportRepository = request.server.repositories.report;
      const report = await reportRepository.findOne({ where: { id: request.params.id } });
      if (!report) {
        return reply.code(404).send({ 
          success: false,
          error: "Report not found" 
        });
      }
      return reply.status(200).send({
        success: true,
        data: report,
      });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        error: 'Failed to get report',
      });
    }
  }

  static async updateReport(
    request: FastifyRequest<{ Params: ReportParams; Body: UpdateReportRequest }>,
    reply: FastifyReply
  ) {
    try {
      const reportRepository = request.server.repositories.report;
      const report = await reportRepository.findOne({ where: { id: request.params.id } });
      if (!report) {
        return reply.code(404).send({ 
          success: false,
          error: "Report not found" 
        });
      }
      reportRepository.merge(report, request.body);
      await reportRepository.save(report);
      return reply.status(200).send({
        success: true,
        data: report,
      });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        error: 'Failed to update report',
      });
    }
  }

  static async deleteReport(
    request: FastifyRequest<{ Params: ReportParams }>,
    reply: FastifyReply
  ) {
    try {
      const reportRepository = request.server.repositories.report;
      const result = await reportRepository.delete(request.params.id);
      if (result.affected === 0) {
        return reply.code(404).send({ 
          success: false,
          error: "Report not found" 
        });
      }
      return reply.status(200).send({
        success: true,
        data: { message: "Report deleted successfully" },
      });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({
        success: false,
        error: 'Failed to delete report',
      });
    }
  }
}

