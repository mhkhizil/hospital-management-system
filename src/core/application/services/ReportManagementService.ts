import type { IReportService } from "@/core/domain/services/IReportService";
import type { IReportRepository } from "@/core/domain/repositories/IReportRepository";
import type {
  ReportResponse,
  ReportQueryParams,
} from "@/core/domain/entities/Report";

/**
 * Report Management Service
 * Implements report business logic
 */
export class ReportManagementService implements IReportService {
  constructor(private repository: IReportRepository) {}

  /**
   * Get comprehensive reports for dashboard
   */
  async getReports(params?: ReportQueryParams): Promise<ReportResponse> {
    return await this.repository.getReports(params);
  }
}

