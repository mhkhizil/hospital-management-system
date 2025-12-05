"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  Pill,
  AlertCircle,
  Edit2,
  Activity,
  ClipboardList,
  TestTube,
} from "lucide-react";
import type { TreatmentDetailDTO } from "@/core/application/dtos/TreatmentDTO";

interface TreatmentDetailProps {
  treatment: TreatmentDetailDTO;
  onClose: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
}

/**
 * Format date for display
 */
function formatDate(dateStr?: string): string | null {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format time for display
 */
function formatTime(timeStr?: string): string | null {
  if (!timeStr) return null;
  try {
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
 * Format datetime for display
 */
function formatDateTime(dateStr?: string, timeStr?: string): string | null {
  const date = formatDate(dateStr);
  const time = formatTime(timeStr);
  if (date && time) return `${date} at ${time}`;
  return date || time;
}

/**
 * Get treatment type badge config
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
 * Info item component
 */
function InfoItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string | null | undefined;
  className?: string;
}) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className={className}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium mt-0.5 whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

export function TreatmentDetail({
  treatment,
  onClose,
  onEdit,
  canEdit = false,
}: TreatmentDetailProps) {
  const typeConfig = getTreatmentTypeConfig(treatment.treatment_type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">{treatment.treatment_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
              {treatment.outcome && (
                <Badge variant={getOutcomeVariant(treatment.outcome)} className="capitalize">
                  {treatment.outcome}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-12 sm:ml-0">
          {canEdit && onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Treatment Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Treatment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Treatment Date"
                value={formatDate(treatment.treatment_date)}
              />
              <InfoItem
                label="Treatment Time"
                value={formatTime(treatment.treatment_time)}
              />
              <InfoItem label="Treatment Type" value={typeConfig.label} />
              <InfoItem label="Outcome" value={treatment.outcome} />
              <InfoItem label="Admission ID" value={treatment.admission_id?.toString()} />
              <InfoItem label="Patient ID" value={treatment.patient_id?.toString()} />
            </div>
            {treatment.description && (
              <InfoItem label="Description" value={treatment.description} className="col-span-2" />
            )}
          </CardContent>
        </Card>

        {/* Staff */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Assigned Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {treatment.doctor && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Stethoscope className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{treatment.doctor.name}</p>
                    <p className="text-xs text-muted-foreground">Doctor</p>
                    {treatment.doctor.email && (
                      <p className="text-xs text-muted-foreground mt-1">{treatment.doctor.email}</p>
                    )}
                  </div>
                </div>
              )}
              {treatment.nurse && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{treatment.nurse.name}</p>
                    <p className="text-xs text-muted-foreground">Nurse</p>
                    {treatment.nurse.email && (
                      <p className="text-xs text-muted-foreground mt-1">{treatment.nurse.email}</p>
                    )}
                  </div>
                </div>
              )}
              {!treatment.doctor && !treatment.nurse && (
                <p className="text-sm text-muted-foreground col-span-2">No staff assigned</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medications & Dosage */}
        {(treatment.medications || treatment.dosage) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Medications & Dosage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem label="Medications" value={treatment.medications} />
              <InfoItem label="Dosage" value={treatment.dosage} />
            </CardContent>
          </Card>
        )}

        {/* Results & Findings */}
        {(treatment.results || treatment.findings) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Results & Findings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem label="Results" value={treatment.results} />
              <InfoItem label="Findings" value={treatment.findings} />
            </CardContent>
          </Card>
        )}

        {/* Procedure Notes */}
        {(treatment.pre_procedure_notes || treatment.post_procedure_notes) && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Procedure Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Pre-Procedure Notes" value={treatment.pre_procedure_notes} />
                <InfoItem label="Post-Procedure Notes" value={treatment.post_procedure_notes} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complications */}
        {treatment.complications && (
          <Card className="lg:col-span-2 border-destructive/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                Complications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{treatment.complications}</p>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {treatment.notes && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Additional Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{treatment.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Timestamps */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {treatment.created_at && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Created: {formatDate(treatment.created_at)}
          </span>
        )}
        {treatment.updated_at && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Updated: {formatDate(treatment.updated_at)}
          </span>
        )}
      </div>
    </div>
  );
}

