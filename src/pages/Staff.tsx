import { useDoctorManagement } from "@/core/presentation/hooks/useDoctorManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StaffPage() {
  const { doctors } = useDoctorManagement();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Workforce
        </p>
        <h2 className="mt-2 text-3xl font-semibold">Clinical Staff</h2>
      </div>
      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>Attending Physicians</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-2xl border border-border/60 p-4"
            >
              <p className="text-base font-semibold">{doctor.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {doctor.specialty}
              </p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <Badge
                  variant={
                    doctor.status === "on-duty"
                      ? "default"
                      : doctor.status === "on-leave"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {doctor.status}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Ext: {doctor.extension}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


