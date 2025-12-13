import type {
  ReportResponse,
  ReportQueryParams,
} from "../entities/Report";

/**
 * Report Repository Interface
 * Defines the contract for fetching report data
 */
export interface IReportRepository {
  /**
   * Get comprehensive reports for dashboard
   */
  getReports(params?: ReportQueryParams): Promise<ReportResponse>;
}

