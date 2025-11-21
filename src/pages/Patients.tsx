import * as React from "react";
import { usePatientManagement } from "@/core/presentation/hooks/usePatientManagement";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientsPage() {
  const { patients, loading, searchPatients } = usePatientManagement();
  const [query, setQuery] = React.useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    searchPatients(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Care delivery
        </p>
        <h2 className="mt-2 text-3xl font-semibold">Active Patients</h2>
      </div>

      <Card className="bg-card/70">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle>Patient Registry</CardTitle>
          <Input
            value={query}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Search by name, department, or doctor"
          />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Physician</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {patients.map((patient) => (
                <tr key={patient.id} className="text-sm">
                  <td className="py-3 font-semibold">{patient.fullName}</td>
                  <td className="py-3 text-muted-foreground">
                    {patient.department}
                  </td>
                  <td className="py-3">{patient.attendingPhysician}</td>
                  <td className="py-3">
                    <Badge
                      variant={
                        patient.status === "admitted"
                          ? "default"
                          : patient.status === "outpatient"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-xs text-muted-foreground">
                    {new Date(patient.lastVisit).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Loading patient data...
            </p>
          )}
          {!loading && patients.length === 0 && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              No patients match your query.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


