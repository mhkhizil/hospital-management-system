import type { Column } from "@/components/reassembledComps/data-table";
import type { TreatmentListDTO } from "@/core/application/dtos/TreatmentDTO";
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
 * Format time for display
 */
function formatTime(timeStr?: string): string {
  if (!timeStr) return "";
  try {
    // Handle HH:mm:ss format
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch {
    return timeStr;
  }
}

/**
 * Get treatment type badge variant and label
 */
function getTreatmentTypeConfig(type: string): { variant: "default" | "secondary" | "outline" | "destructive"; label: string } {
  const typeMap: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
    surgery: { variant: "destructive", label: "Surgery" },
    medication: { variant: "default", label: "Medication" },
    diagnostic: { variant: "secondary", label: "Diagnostic" },
    procedure: { variant: "outline", label: "Procedure" },
    consultation: { variant: "outline", label: "Consultation" },
    physical_therapy: { variant: "secondary", label: "Physical Therapy" },
    radiotherapy: { variant: "destructive", label: "Radiotherapy" },
    chemotherapy: { variant: "destructive", label: "Chemotherapy" },
    targeted_therapy: { variant: "outline", label: "Targeted Therapy" },
    hormone_therapy: { variant: "outline", label: "Hormone Therapy" },
    immunotherapy: { variant: "outline", label: "Immunotherapy" },
    intervention_therapy: { variant: "outline", label: "Intervention Therapy" },
    supportive_care: { variant: "secondary", label: "Supportive Care" },
    other: { variant: "outline", label: "Other" },
  };

  return typeMap[type] || { variant: "outline", label: type };
}

/**
 * Get outcome badge variant
 */
function getOutcomeVariant(outcome?: string): "default" | "secondary" | "destructive" | "outline" {
  switch (outcome) {
    case "successful":
    case "completed":
      return "default";
    case "ongoing":
    case "pending":
      return "secondary";
    case "partial":
      return "outline";
    case "unsuccessful":
      return "destructive";
    default:
      return "secondary";
  }
}

/**
 * Get columns for treatment list table
 */
export function getTreatmentColumns(): Column<TreatmentListDTO>[] {
  return [
    {
      key: "treatment_name",
      header: "Treatment",
      render: (treatment) => {
        const typeConfig = getTreatmentTypeConfig(treatment.treatment_type);
        return (
          <div className="min-w-0">
            <div className="font-medium truncate">{treatment.treatment_name}</div>
            <Badge variant={typeConfig.variant} className="mt-1 text-xs">
              {typeConfig.label}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "description",
      header: "Description",
      className: "hidden lg:table-cell max-w-[250px]",
      render: (treatment) => (
        <span className="text-sm text-muted-foreground truncate block">
          {treatment.description || "-"}
        </span>
      ),
    },
    {
      key: "treatment_date",
      header: "Date & Time",
      render: (treatment) => (
        <div className="text-sm">
          <div>{formatDate(treatment.treatment_date)}</div>
          {treatment.treatment_time && (
            <div className="text-xs text-muted-foreground">
              {formatTime(treatment.treatment_time)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "doctor",
      header: "Doctor",
      className: "hidden md:table-cell",
      render: (treatment) => (
        <span className="text-sm text-muted-foreground">
          {treatment.doctor?.name ?? "-"}
        </span>
      ),
    },
    {
      key: "outcome",
      header: "Outcome",
      render: (treatment) => (
        treatment.outcome ? (
          <Badge variant={getOutcomeVariant(treatment.outcome)} className="capitalize">
            {treatment.outcome}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )
      ),
    },
  ];
}

