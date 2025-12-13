import type {
  ReportResponse,
  ReportQueryParams,
} from "../entities/Report";

/**
 * Report Service Interface
 * Defines the contract for report business logic
 */
export interface IReportService {
  /**
   * Get comprehensive reports for dashboard
   */
  getReports(params?: ReportQueryParams): Promise<ReportResponse>;
}

