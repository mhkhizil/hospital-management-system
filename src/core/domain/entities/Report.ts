/**
 * Report Entity
 * Comprehensive statistics and aggregated data for dashboard visualization
 */

// Date range for report
export interface DateRange {
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
}

// Summary statistics
export interface SummaryStatistics {
  total_patients: number;
  total_admissions: number;
  active_admissions: number;
  total_treatments: number;
  total_staff: number;
}

// Patient statistics
export interface PatientStatistics {
  by_gender: Record<string, number>;
  by_blood_type: Record<string, number>;
  by_age_group: Record<string, number>;
  by_marital_status: Record<string, number>;
  registrations_over_time: TimeSeriesData[];
}

// Admission statistics
export interface AdmissionStatistics {
  by_type: Record<string, number>;
  by_status: Record<string, number>;
  by_department: Record<string, number>;
  admissions_over_time: TimeSeriesData[];
  discharges_over_time: TimeSeriesData[];
  average_length_of_stay: number | null;
}

// Treatment statistics
export interface TreatmentStatistics {
  by_type: Record<string, number>;
  by_outcome: Record<string, number>;
  treatments_over_time: TimeSeriesData[];
  treatments_by_month: MonthlyData[];
}

// Department statistics
export interface DepartmentStatistics {
  admissions_by_service: ServiceData[];
  top_departments: Record<string, number>;
}

// Time series data
export interface TimeSeriesData {
  date: string; // YYYY-MM-DD
  count: number;
}

// Monthly data
export interface MonthlyData {
  month: string; // YYYY-MM
  count: number;
}

// Service data
export interface ServiceData {
  service: string;
  count: number;
}

// Staff workload
export interface StaffWorkload {
  doctors: StaffWorkloadItem[];
  nurses: StaffWorkloadItem[];
}

export interface StaffWorkloadItem {
  id: number;
  name: string;
  admissions_count: number;
}

// Time series data (additional)
export interface TimeSeriesStatistics {
  daily_admissions: TimeSeriesData[];
  monthly_admissions: MonthlyData[];
  monthly_discharges: MonthlyData[];
}

// Complete report data
export interface ReportData {
  summary: SummaryStatistics;
  patients: PatientStatistics;
  admissions: AdmissionStatistics;
  treatments: TreatmentStatistics;
  departments: DepartmentStatistics;
  time_series: TimeSeriesStatistics;
  staff_workload: StaffWorkload;
}

// API response
export interface ReportResponse {
  message: string;
  date_range: DateRange;
  data: ReportData;
}

// Report query parameters
export interface ReportQueryParams {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
}
