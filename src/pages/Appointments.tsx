import { useAppointmentManagement } from "@/core/presentation/hooks/useAppointmentManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AppointmentsPage() {
  const { appointments } = useAppointmentManagement();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Scheduling
        </p>
        <h2 className="mt-2 text-3xl font-semibold">Appointments</h2>
      </div>

      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>Next 24 hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between rounded-2xl border border-border/60 p-4"
            >
              <div>
                <p className="text-sm font-semibold">
                  {appointment.patientName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {appointment.doctorName} · {appointment.department}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium">
                  {new Date(appointment.scheduledAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <Badge
                  variant={
                    appointment.status === "active"
                      ? "default"
                      : appointment.status === "pending"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {appointment.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
