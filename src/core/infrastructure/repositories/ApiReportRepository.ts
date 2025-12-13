import type { IReportRepository } from "@/core/domain/repositories/IReportRepository";
import type {
  ReportResponse,
  ReportQueryParams,
} from "@/core/domain/entities/Report";
import type { HttpClient } from "../api/HttpClient";
import { API_ENDPOINTS } from "../api/constants";

/**
 * API implementation of Report Repository
 */
export class ApiReportRepository implements IReportRepository {
  constructor(private http: HttpClient) {}

  /**
   * Get comprehensive reports for dashboard
   */
  async getReports(params?: ReportQueryParams): Promise<ReportResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.start_date) {
      queryParams.append("start_date", params.start_date);
    }
    if (params?.end_date) {
      queryParams.append("end_date", params.end_date);
    }

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.REPORTS}?${queryParams.toString()}`
      : API_ENDPOINTS.REPORTS;

    const { data } = await this.http.get<ReportResponse>(url);
    return data;
  }
}

