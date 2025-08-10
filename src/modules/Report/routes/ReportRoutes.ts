import { FastifyInstance } from "fastify";
import { ReportController } from "../controllers/ReportController";
import { CreateReportSchema, UpdateReportSchema, ReportQuerySchema, ReportParamsSchema } from "../interfaces/Report";

const reportRoutes = async (fastify: FastifyInstance) => {
  // 리포트 생성
  fastify.post("/", {
    schema: {
      body: CreateReportSchema,
      tags: ["Report"],
      description: "새로운 리포트를 생성합니다",
    },
    handler: ReportController.createReport,
  });

  // 모든 리포트 조회
  fastify.get("/", {
    schema: {
      querystring: ReportQuerySchema,
      tags: ["Report"],
      description: "모든 리포트를 조회합니다",
    },
    handler: ReportController.getAllReports,
  });

  // 특정 리포트 조회
  fastify.get("/:id", {
    schema: {
      params: ReportParamsSchema,
      tags: ["Report"],
      description: "특정 리포트를 조회합니다",
    },
    handler: ReportController.getReportById,
  });

  // 특정 리포트 업데이트
  fastify.put("/:id", {
    schema: {
      params: ReportParamsSchema,
      body: UpdateReportSchema,
      tags: ["Report"],
      description: "특정 리포트를 업데이트합니다",
    },
    handler: ReportController.updateReport,
  });

  // 특정 리포트 삭제
  fastify.delete("/:id", {
    schema: {
      params: ReportParamsSchema,
      tags: ["Report"],
      description: "특정 리포트를 삭제합니다",
    },
    handler: ReportController.deleteReport,
  });
};

export default reportRoutes;
