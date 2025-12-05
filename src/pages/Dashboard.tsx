import { StatsCards } from "@/components/dashboard/StatsCards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MiniChatBox } from "@/components/chat";

const wards = [
  { name: "General Ward", occupancy: "92%", beds: "46 / 50" },
  { name: "Pediatrics", occupancy: "64%", beds: "32 / 50" },
  { name: "Maternity", occupancy: "88%", beds: "44 / 50" },
];

const upcoming = [
  { patient: "Nang Su Su", doctor: "Dr. Thant", time: "09:30 AM" },
  { patient: "Ko Zaw Lin", doctor: "Dr. Han", time: "10:45 AM" },
  { patient: "Mg Kyaw Htet", doctor: "Dr. Myint", time: "01:15 PM" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Real-time status
        </p>
        <h2 className="mt-2 text-3xl font-semibold">Hospital Command Center</h2>
      </div>

      <StatsCards />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle>Ward Occupancy</CardTitle>
            <CardDescription>Live bed availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {wards.map((ward) => (
              <div key={ward.name} className="rounded-2xl border border-border/60 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{ward.name}</p>
                    <p className="text-xl font-semibold">{ward.occupancy}</p>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {ward.beds} beds
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: ward.occupancy }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/70">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Next 6 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcoming.map((item) => (
              <div
                key={`${item.patient}-${item.time}`}
                className="rounded-2xl border border-border/60 p-4"
              >
                <p className="text-sm font-semibold">{item.patient}</p>
                <p className="text-xs text-muted-foreground">
                  {item.doctor} · {item.time}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Mini Chat Box */}
      <MiniChatBox />
    </div>
  );
}


