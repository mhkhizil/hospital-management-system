import * as XLSX from "xlsx";
import type {
  ReportData,
  DateRange,
} from "@/core/domain/entities/Report";

/**
 * Export report data to Excel with multiple sheets
 */
export function exportToExcel(
  reportData: ReportData,
  dateRange: DateRange | null
): void {
  const workbook = XLSX.utils.book_new();

  // Helper function to create a worksheet from array of objects
  const createSheet = (data: any[], sheetName: string) => {
    if (data.length === 0) {
      // Create empty sheet with headers if no data
      const ws = XLSX.utils.aoa_to_sheet([["No data available"]]);
      XLSX.utils.book_append_sheet(workbook, ws, sheetName);
      return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
  };

  // Helper function to create a sheet from key-value pairs
  const createKeyValueSheet = (
    data: Record<string, number | string>,
    sheetName: string
  ) => {
    const rows = Object.entries(data).map(([key, value]) => ({
      Item: key,
      Count: value,
    }));
    createSheet(rows, sheetName);
  };

  // 1. Summary Sheet
  const summaryData = [
    { Metric: "Total Patients", Value: reportData.summary.total_patients },
    {
      Metric: "Total Admissions",
      Value: reportData.summary.total_admissions,
    },
    {
      Metric: "Active Admissions",
      Value: reportData.summary.active_admissions,
    },
    {
      Metric: "Total Treatments",
      Value: reportData.summary.total_treatments,
    },
    { Metric: "Total Staff", Value: reportData.summary.total_staff },
  ];
  createSheet(summaryData, "Summary");

  // 2. Patient Demographics Sheet
  const patientDemographics = [
    { Category: "Gender Distribution", ...reportData.patients.by_gender },
    { Category: "Blood Type Distribution", ...reportData.patients.by_blood_type },
    {
      Category: "Age Group Distribution",
      ...reportData.patients.by_age_group,
    },
    {
      Category: "Marital Status Distribution",
      ...reportData.patients.by_marital_status,
    },
  ];
  createSheet(patientDemographics, "Patient Demographics");

  // 3. Patient Registrations Over Time
  if (reportData.patients.registrations_over_time.length > 0) {
    createSheet(
      reportData.patients.registrations_over_time.map((item) => ({
        Date: item.date,
        "Patient Registrations": item.count,
      })),
      "Patient Registrations"
    );
  }

  // 4. Admissions by Type
  createKeyValueSheet(
    reportData.admissions.by_type,
    "Admissions by Type"
  );

  // 5. Admissions by Status
  createKeyValueSheet(
    reportData.admissions.by_status,
    "Admissions by Status"
  );

  // 6. Admissions by Department
  createKeyValueSheet(
    reportData.admissions.by_department,
    "Admissions by Department"
  );

  // 7. Admissions Over Time
  if (reportData.admissions.admissions_over_time.length > 0) {
    createSheet(
      reportData.admissions.admissions_over_time.map((item) => ({
        Date: item.date,
        Admissions: item.count,
      })),
      "Daily Admissions"
    );
  }

  // 8. Discharges Over Time
  if (reportData.admissions.discharges_over_time.length > 0) {
    createSheet(
      reportData.admissions.discharges_over_time.map((item) => ({
        Date: item.date,
        Discharges: item.count,
      })),
      "Daily Discharges"
    );
  }

  // 9. Admissions Metrics
  const admissionMetrics = [
    {
      Metric: "Average Length of Stay (days)",
      Value: reportData.admissions.average_length_of_stay.toFixed(2),
    },
    {
      Metric: "Inpatient Admissions",
      Value: reportData.admissions.by_type.inpatient || 0,
    },
    {
      Metric: "Outpatient Admissions",
      Value: reportData.admissions.by_type.outpatient || 0,
    },
  ];
  createSheet(admissionMetrics, "Admission Metrics");

  // 10. Treatments by Type
  createKeyValueSheet(
    reportData.treatments.by_type,
    "Treatments by Type"
  );

  // 11. Treatments by Outcome
  createKeyValueSheet(
    reportData.treatments.by_outcome,
    "Treatments by Outcome"
  );

  // 12. Treatments Over Time
  if (reportData.treatments.treatments_over_time.length > 0) {
    createSheet(
      reportData.treatments.treatments_over_time.map((item) => ({
        Date: item.date,
        Treatments: item.count,
      })),
      "Daily Treatments"
    );
  }

  // 13. Treatments by Month
  if (reportData.treatments.treatments_by_month.length > 0) {
    createSheet(
      reportData.treatments.treatments_by_month.map((item) => ({
        Month: item.month,
        Treatments: item.count,
      })),
      "Monthly Treatments"
    );
  }

  // 14. Departments
  if (reportData.departments.admissions_by_service.length > 0) {
    createSheet(
      reportData.departments.admissions_by_service.map((item) => ({
        Department: item.service,
        "Admission Count": item.count,
      })),
      "Department Admissions"
    );
  }

  // 15. Top Departments
  createKeyValueSheet(
    reportData.departments.top_departments,
    "Top Departments"
  );

  // 16. Staff Workload - Doctors
  if (reportData.staff_workload.doctors.length > 0) {
    createSheet(
      reportData.staff_workload.doctors.map((doctor) => ({
        "Doctor ID": doctor.id,
        "Doctor Name": doctor.name,
        "Admissions Count": doctor.admissions_count,
      })),
      "Doctor Workload"
    );
  }

  // 17. Staff Workload - Nurses
  if (reportData.staff_workload.nurses.length > 0) {
    createSheet(
      reportData.staff_workload.nurses.map((nurse) => ({
        "Nurse ID": nurse.id,
        "Nurse Name": nurse.name,
        "Admissions Count": nurse.admissions_count,
      })),
      "Nurse Workload"
    );
  }

  // 18. Monthly Admissions
  if (reportData.time_series.monthly_admissions.length > 0) {
    createSheet(
      reportData.time_series.monthly_admissions.map((item) => ({
        Month: item.month,
        Admissions: item.count,
      })),
      "Monthly Admissions"
    );
  }

  // 19. Monthly Discharges
  if (reportData.time_series.monthly_discharges.length > 0) {
    createSheet(
      reportData.time_series.monthly_discharges.map((item) => ({
        Month: item.month,
        Discharges: item.count,
      })),
      "Monthly Discharges"
    );
  }

  // Generate filename
  const startDate = dateRange?.start_date || "unknown";
  const endDate = dateRange?.end_date || "unknown";
  const filename = `hospital-report-${startDate}-to-${endDate}.xlsx`;

  // Write and download
  XLSX.writeFile(workbook, filename);
}

