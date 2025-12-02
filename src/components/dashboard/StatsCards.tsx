import { motion } from "framer-motion";
import { Activity, HeartPulse, Stethoscope, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Admitted Patients",
    value: "182",
    change: "+12 today",
    icon: Users,
  },
  {
    title: "ICU Occupancy",
    value: "78%",
    change: "Stable",
    icon: Activity,
  },
  {
    title: "Scheduled Surgeries",
    value: "14",
    change: "6 completed",
    icon: Stethoscope,
  },
  {
    title: "Emergency Wait",
    value: "18 min",
    change: "-5 min vs avg",
    icon: HeartPulse,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-card/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <CardDescription>{stat.change}</CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}


