import type { Column } from "@/components/reassembledComps/data-table";
import type { AdmissionListDTO } from "@/core/application/dtos/AdmissionDTO";
import { Badge } from "@/components/ui/badge";

/**
 * Format date for display
 */
function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Get status badge variant
 */
function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "admitted":
      return "default";
    case "discharged":
      return "secondary";
    case "deceased":
      return "destructive";
    case "transferred":
      return "outline";
    default:
      return "secondary";
  }
}

/**
 * Get admission type badge variant
 */
function getTypeVariant(type: string): "default" | "secondary" | "outline" {
  switch (type) {
    case "inpatient":
      return "default";
    case "outpatient":
      return "outline";
    default:
      return "secondary";
  }
}

/**
 * Get columns for admission list table
 */
export function getAdmissionColumns(): Column<AdmissionListDTO>[] {
  return [
    {
      key: "admission_number",
      header: "Admission #",
      render: (admission) => (
        <div className="min-w-0">
          <div className="font-mono text-sm font-medium">{admission.admission_number}</div>
          <div className="text-xs text-muted-foreground">
            {formatDate(admission.admission_date)}
          </div>
        </div>
      ),
    },
    {
      key: "patient",
      header: "Patient",
      render: (admission) => (
        <div className="min-w-0">
          <div className="font-semibold truncate">{admission.patient?.name ?? "-"}</div>
          {admission.patient?.nrc_number && (
            <div className="text-xs text-muted-foreground truncate">
              {admission.patient.nrc_number}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (admission) => (
        <Badge variant={getTypeVariant(admission.admission_type)} className="capitalize">
          {admission.admission_type}
        </Badge>
      ),
    },
    {
      key: "admitted_for",
      header: "Reason",
      className: "hidden lg:table-cell max-w-[200px]",
      render: (admission) => (
        <span className="text-sm text-muted-foreground truncate block">
          {admission.admitted_for || "-"}
        </span>
      ),
    },
    {
      key: "location",
      header: "Location",
      className: "hidden md:table-cell",
      render: (admission) => (
        <div className="text-sm">
          {admission.ward ? (
            <>
              <div>{admission.ward}</div>
              {admission.bed_number && (
                <div className="text-xs text-muted-foreground">Bed: {admission.bed_number}</div>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      key: "doctor",
      header: "Doctor",
      className: "hidden lg:table-cell",
      render: (admission) => (
        <span className="text-sm text-muted-foreground">
          {admission.doctor?.name ?? "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (admission) => (
        <Badge variant={getStatusVariant(admission.status)} className="capitalize">
          {admission.status}
        </Badge>
      ),
    },
  ];
}



