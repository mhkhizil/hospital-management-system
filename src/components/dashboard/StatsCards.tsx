import { motion } from "framer-motion";
import {
  Activity,
  Users,
  UserPlus,
  Stethoscope,
  Building2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SummaryStatistics } from "@/core/domain/entities/Report";

interface StatsCardsProps {
  summary?: SummaryStatistics;
}

export function StatsCards({ summary }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Patients",
      value: summary?.total_patients?.toLocaleString() || "0",
      description: "Registered patients",
      icon: Users,
    },
    {
      title: "Active Admissions",
      value: summary?.active_admissions?.toLocaleString() || "0",
      description: "Currently admitted",
      icon: Activity,
    },
    {
      title: "Total Admissions",
      value: summary?.total_admissions?.toLocaleString() || "0",
      description: "All time",
      icon: UserPlus,
    },
    {
      title: "Total Treatments",
      value: summary?.total_treatments?.toLocaleString() || "0",
      description: "All time",
      icon: Stethoscope,
    },
    {
      title: "Staff Members",
      value: summary?.total_staff?.toLocaleString() || "0",
      description: "Doctors & Nurses",
      icon: Building2,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-card/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <CardDescription className="text-xs">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}


