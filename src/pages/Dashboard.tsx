import { useState } from "react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MiniChatBox } from "@/components/chat";
import { useReports } from "@/core/presentation/hooks/useReports";
import {
  GenderPieChart,
  BloodTypeBarChart,
  AdmissionStatusPieChart,
  AdmissionsLineChart,
  TreatmentTypeBarChart,
  DepartmentBarChart,
  MonthlyTrendsChart,
  AgeGroupPieChart,
} from "@/components/dashboard/ChartComponents";
import { Download, Calendar, RefreshCw, FileSpreadsheet, FileJson } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToExcel } from "@/utils/excelExport";

export default function DashboardPage() {
  // Get last 6 months by default
  const getDefaultDates = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    return {
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
    };
  };

  const [dateRange, setDateRange] = useState(getDefaultDates());
  const { reportData, dateRange: apiDateRange, isLoading, error, refreshReports } = useReports(
    dateRange
  );

  const handleDateChange = (field: "start_date" | "end_date", value: string) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleRefresh = () => {
    refreshReports(dateRange);
  };

  const handleExportExcel = () => {
    if (!reportData || !apiDateRange) return;
    exportToExcel(reportData, apiDateRange);
  };

  const handleExportJSON = () => {
    if (!reportData) return;

    // Create comprehensive JSON export
    const exportData = {
      date_range: apiDateRange,
      generated_at: new Date().toISOString(),
      summary: reportData.summary,
      patients: reportData.patients,
      admissions: reportData.admissions,
      treatments: reportData.treatments,
      departments: reportData.departments,
      time_series: reportData.time_series,
      staff_workload: reportData.staff_workload,
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `hospital-report-${apiDateRange?.start_date}-to-${apiDateRange?.end_date}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Hospital analytics and insights
          </p>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Data</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Analytics Dashboard
          </p>
          <h2 className="mt-2 text-3xl font-semibold">
            Hospital Command Center
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                disabled={isLoading || !reportData}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportJSON}>
                <FileJson className="mr-2 h-4 w-4" />
                Export as JSON (.json)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Date Range Filter
          </CardTitle>
          <CardDescription>
            {apiDateRange &&
              `Showing data from ${new Date(apiDateRange.start_date).toLocaleDateString()} to ${new Date(apiDateRange.end_date).toLocaleDateString()}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={dateRange.start_date}
                onChange={(e) => handleDateChange("start_date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={dateRange.end_date}
                onChange={(e) => handleDateChange("end_date", e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleRefresh} className="w-full">
                Apply Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {isLoading && !reportData ? (
        <div className="flex h-32 items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <StatsCards summary={reportData?.summary} />
      )}

      {/* Charts Grid */}
      {reportData && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Gender Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/70">
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Patient demographics by gender</CardDescription>
              </CardHeader>
              <CardContent>
                <GenderPieChart data={reportData.patients.by_gender} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Age Groups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/70">
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Patients by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <AgeGroupPieChart data={reportData.patients.by_age_group} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Admission Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/70">
              <CardHeader>
                <CardTitle>Admission Status</CardTitle>
                <CardDescription>Current admission breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <AdmissionStatusPieChart
                  data={reportData.admissions.by_status}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Blood Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card/70">
              <CardHeader>
                <CardTitle>Blood Type Distribution</CardTitle>
                <CardDescription>Patient blood type statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <BloodTypeBarChart data={reportData.patients.by_blood_type} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Departments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card/70">
              <CardHeader>
                <CardTitle>Top Departments</CardTitle>
                <CardDescription>
                  Admissions by department/service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DepartmentBarChart
                  data={reportData.departments.top_departments}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Treatment Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-card/70">
              <CardHeader>
                <CardTitle>Treatment Types</CardTitle>
                <CardDescription>Most common treatments</CardDescription>
              </CardHeader>
              <CardContent>
                <TreatmentTypeBarChart data={reportData.treatments.by_type} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Admissions Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card/70">
              <CardHeader>
                <CardTitle>Daily Admissions Trend</CardTitle>
                <CardDescription>Admissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <AdmissionsLineChart
                  data={reportData.admissions.admissions_over_time}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card/70">
              <CardHeader>
                <CardTitle>Monthly Admissions & Discharges</CardTitle>
                <CardDescription>Monthly trend comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyTrendsChart
                  admissions={reportData.time_series.monthly_admissions}
                  discharges={reportData.time_series.monthly_discharges}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Staff Workload */}
          {reportData.staff_workload.doctors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="bg-card/70">
                <CardHeader>
                  <CardTitle>Top Doctors by Workload</CardTitle>
                  <CardDescription>Admissions handled</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reportData.staff_workload.doctors.slice(0, 5).map((doctor, idx) => (
                    <div
                      key={doctor.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium">{doctor.name}</span>
                      </div>
                      <span className="text-lg font-bold">
                        {doctor.admissions_count}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Nurses Workload */}
          {reportData.staff_workload.nurses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="bg-card/70">
                <CardHeader>
                  <CardTitle>Top Nurses by Workload</CardTitle>
                  <CardDescription>Admissions assisted</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reportData.staff_workload.nurses.slice(0, 5).map((nurse, idx) => (
                    <div
                      key={nurse.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium">{nurse.name}</span>
                      </div>
                      <span className="text-lg font-bold">
                        {nurse.admissions_count}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Key Metrics Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card/70">
              <CardHeader>
                <CardTitle>Key Metrics Summary</CardTitle>
                <CardDescription>Important statistics at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-sm text-muted-foreground">
                      Average Length of Stay
                    </p>
                    <p className="text-2xl font-bold">
                      {reportData.admissions.average_length_of_stay.toFixed(1)} days
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-sm text-muted-foreground">
                      Inpatient Admissions
                    </p>
                    <p className="text-2xl font-bold">
                      {reportData.admissions.by_type.inpatient?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-sm text-muted-foreground">
                      Outpatient Admissions
                    </p>
                    <p className="text-2xl font-bold">
                      {reportData.admissions.by_type.outpatient?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Mini Chat Box */}
      <MiniChatBox />
    </div>
  );
}


