import { useState, useEffect, useCallback } from "react";
import { container, TOKENS } from "@/core/infrastructure/di/container";
import type { IReportService } from "@/core/domain/services/IReportService";
import type {
  ReportData,
  DateRange,
  ReportQueryParams,
} from "@/core/domain/entities/Report";

/**
 * Hook for fetching and managing dashboard reports
 */
export function useReports(initialParams?: ReportQueryParams) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reportService = container.resolve<IReportService>(
    TOKENS.REPORT_SERVICE
  );

  /**
   * Fetch reports with optional date range parameters
   */
  const fetchReports = useCallback(
    async (params?: ReportQueryParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await reportService.getReports(params);
        setReportData(response.data);
        setDateRange(response.date_range);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch reports"
        );
        setReportData(null);
        setDateRange(null);
      } finally {
        setIsLoading(false);
      }
    },
    [reportService]
  );

  /**
   * Refresh reports with current or new parameters
   */
  const refreshReports = useCallback(
    (params?: ReportQueryParams) => {
      fetchReports(params);
    },
    [fetchReports]
  );

  // Initial fetch on mount
  useEffect(() => {
    fetchReports(initialParams);
  }, [fetchReports, initialParams]);

  return {
    reportData,
    dateRange,
    isLoading,
    error,
    fetchReports,
    refreshReports,
  };
}
