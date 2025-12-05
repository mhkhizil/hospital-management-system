import type { Column } from "@/components/reassembledComps/data-table";
import type { PatientListDTO } from "@/core/application/dtos/PatientDTO";
import { Badge } from "@/components/ui/badge";

/**
 * Get columns for patient list table
 */
export function getPatientColumns(): Column<PatientListDTO>[] {
  return [
    {
      key: "name",
      header: "Patient",
      render: (patient) => (
        <div className="min-w-0">
          <div className="font-semibold truncate">{patient.name}</div>
          {patient.nrc_number && (
            <div className="text-xs text-muted-foreground truncate">
              {patient.nrc_number}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      className: "hidden lg:table-cell",
      render: (patient) => (
        <span className="text-muted-foreground">
          {patient.contact_phone || "-"}
        </span>
      ),
    },
    {
      key: "demographics",
      header: "Age / Sex",
      render: (patient) => (
        <div className="text-sm">
          {patient.age ? `${patient.age} yrs` : "-"}
          {patient.sex && patient.sex !== "Unknown" && (
            <span className="text-muted-foreground"> / {patient.sex}</span>
          )}
        </div>
      ),
    },
    {
      key: "admissions",
      header: "Admissions",
      className: "hidden md:table-cell",
      render: (patient) => (
        <span className="text-sm">{patient.admissions_count}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (patient) => (
        <Badge
          variant={patient.admissions_count > 0 ? "default" : "secondary"}
          className="whitespace-nowrap"
        >
          {patient.admissions_count > 0 ? "Admitted" : "Not Admitted Yet"}
        </Badge>
      ),
    },
  ];
}

/**
 * Get columns for patient search results (simplified)
 */
export function getSearchResultColumns(): Column<PatientListDTO>[] {
  return [
    {
      key: "name",
      header: "Patient",
      render: (patient) => (
        <div>
          <div className="font-semibold">{patient.name}</div>
          <div className="text-xs text-muted-foreground">
            {patient.nrc_number || "No NRC"}
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (patient) => (
        <span className="text-sm text-muted-foreground">
          {patient.contact_phone || "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (patient) => (
        <Badge
          variant={patient.admissions_count > 0 ? "default" : "outline"}
        >
          {patient.admissions_count > 0 ? "Admitted" : "Not Admitted Yet"}
        </Badge>
      ),
    },
  ];
}

