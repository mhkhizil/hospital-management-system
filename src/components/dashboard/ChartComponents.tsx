/**
 * Dashboard Chart Components
 * Reusable chart components using Recharts library
 */
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Color palette for charts
export const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted))",
  colors: [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#f97316", // orange
    "#84cc16", // lime
    "#6366f1", // indigo
  ],
};

interface GenderChartProps {
  data: Record<string, number>;
}

export function GenderPieChart({ data }: GenderChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS.colors[index % CHART_COLORS.colors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface BloodTypeChartProps {
  data: Record<string, number>;
}

export function BloodTypeBarChart({ data }: BloodTypeChartProps) {
  const chartData = Object.entries(data).map(([bloodType, count]) => ({
    bloodType,
    count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="bloodType" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill={CHART_COLORS.primary} name="Patients" />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface AdmissionStatusProps {
  data: Record<string, number>;
}

export function AdmissionStatusPieChart({ data }: AdmissionStatusProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS.colors[index % CHART_COLORS.colors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface TimeSeriesData {
  date: string;
  count: number;
}

interface AdmissionsLineChartProps {
  data: TimeSeriesData[];
}

export function AdmissionsLineChart({ data }: AdmissionsLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(value) => {
            const date = new Date(value as string);
            return date.toLocaleDateString();
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          name="Admissions"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface TreatmentTypeChartProps {
  data: Record<string, number>;
}

export function TreatmentTypeBarChart({ data }: TreatmentTypeChartProps) {
  const chartData = Object.entries(data)
    .map(([type, count]) => ({
      type: type
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis type="number" />
        <YAxis dataKey="type" type="category" width={150} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill={CHART_COLORS.colors[4]} name="Treatments" />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface DepartmentChartProps {
  data: Record<string, number>;
}

export function DepartmentBarChart({ data }: DepartmentChartProps) {
  const chartData = Object.entries(data)
    .map(([dept, count]) => ({
      department: dept,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="department" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill={CHART_COLORS.colors[2]} name="Admissions" />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface MonthlyData {
  month: string;
  count: number;
}

interface MonthlyTrendsProps {
  admissions: MonthlyData[];
  discharges: MonthlyData[];
}

export function MonthlyTrendsChart({
  admissions,
  discharges,
}: MonthlyTrendsProps) {
  // Merge data by month
  const mergedData = admissions.map((adm) => {
    const discharge = discharges.find((d) => d.month === adm.month);
    return {
      month: adm.month,
      admissions: adm.count,
      discharges: discharge?.count || 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={mergedData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis
          dataKey="month"
          tickFormatter={(value) => {
            const [year, month] = value.split("-");
            return `${month}/${year.slice(2)}`;
          }}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(value) => {
            const [year, month] = (value as string).split("-");
            return `${month}/${year}`;
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="admissions"
          stackId="1"
          stroke={CHART_COLORS.colors[0]}
          fill={CHART_COLORS.colors[0]}
          name="Admissions"
        />
        <Area
          type="monotone"
          dataKey="discharges"
          stackId="2"
          stroke={CHART_COLORS.colors[1]}
          fill={CHART_COLORS.colors[1]}
          name="Discharges"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface AgeGroupChartProps {
  data: Record<string, number>;
}

export function AgeGroupPieChart({ data }: AgeGroupChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS.colors[index % CHART_COLORS.colors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
