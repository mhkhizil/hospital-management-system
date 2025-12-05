"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Stethoscope,
  Activity,
  FileText,
  Clock,
  Building,
  Bed,
  AlertCircle,
  Edit2,
  LogOut,
  Repeat,
  Skull,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { AdmissionDetailDTO } from "@/core/application/dtos/AdmissionDTO";

interface AdmissionDetailProps {
  admission: AdmissionDetailDTO;
  onClose: () => void;
  onEdit?: () => void;
  onDischarge?: () => void;
  onConvertToInpatient?: () => void;
  onConfirmDeath?: () => void;
  canEdit?: boolean;
  canDischarge?: boolean;
}

/**
 * Format date for display
 */
function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
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
 * Format datetime for display
 */
function formatDateTime(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return "-";
  const date = formatDate(dateStr);
  if (timeStr) {
    return `${date} at ${timeStr}`;
  }
  return date;
}

/**
 * Info item component
 */
function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: string | null;
  className?: string;
}) {
  if (!value) return null;
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
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

export function AdmissionDetail({
  admission,
  onClose,
  onEdit,
  onDischarge,
  onConvertToInpatient,
  onConfirmDeath,
  canEdit = false,
  canDischarge = false,
}: AdmissionDetailProps) {
  const isAdmitted = admission.status === "admitted";
  const isOutpatient = admission.admission_type === "outpatient";
  const canConvert = isAdmitted && isOutpatient && canEdit;
  const canDischargeCurrent = isAdmitted && canDischarge;
  const canConfirmDeathCurrent = isAdmitted && canDischarge;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{admission.admission_number}</h2>
              <Badge variant={getStatusVariant(admission.status)} className="capitalize">
                {admission.status}
              </Badge>
              <Badge variant={admission.admission_type === "inpatient" ? "default" : "outline"} className="capitalize">
                {admission.admission_type}
              </Badge>
            </div>
            {admission.patient && (
              <p className="text-sm text-muted-foreground mt-1">
                Patient: {admission.patient.name}
                {admission.patient.nrc_number && ` (${admission.patient.nrc_number})`}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canEdit && isAdmitted && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {canConvert && (
            <Button variant="outline" size="sm" onClick={onConvertToInpatient}>
              <Repeat className="h-4 w-4 mr-2" />
              Convert to Inpatient
            </Button>
          )}
          {canDischargeCurrent && (
            <Button variant="default" size="sm" onClick={onDischarge}>
              <LogOut className="h-4 w-4 mr-2" />
              Discharge
            </Button>
          )}
          {canConfirmDeathCurrent && (
            <Button variant="destructive" size="sm" onClick={onConfirmDeath}>
              <Skull className="h-4 w-4 mr-2" />
              Confirm Death
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admission Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Admission Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Admission Date" value={formatDateTime(admission.admission_date, admission.admission_time)} />
              <InfoItem label="Service" value={admission.service} />
            </div>
            {admission.length_of_stay !== undefined && admission.length_of_stay > 0 && (
              <InfoItem label="Length of Stay" value={`${admission.length_of_stay} day(s)`} />
            )}
            <InfoItem label="Reason for Admission" value={admission.admitted_for} className="col-span-2" />
            {admission.referred_by && (
              <InfoItem label="Referred By" value={admission.referred_by} />
            )}
            {admission.police_case === "yes" && (
              <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive font-medium">Police Case</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {admission.ward ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ward</p>
                    <p className="font-medium">{admission.ward}</p>
                  </div>
                </div>
                {admission.bed_number && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Bed className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Bed</p>
                      <p className="font-medium">{admission.bed_number}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {isOutpatient ? "Outpatient visit - no ward assignment" : "No ward assigned"}
              </p>
            )}
            {admission.present_address && (
              <InfoItem label="Present Address" value={admission.present_address} />
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
              {admission.doctor && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Stethoscope className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Doctor</p>
                    <p className="text-sm font-medium">{admission.doctor.name}</p>
                    {admission.doctor.email && (
                      <p className="text-xs text-muted-foreground">{admission.doctor.email}</p>
                    )}
                  </div>
                </div>
              )}
              {admission.nurse && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-full bg-green-500/10">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nurse</p>
                    <p className="text-sm font-medium">{admission.nurse.name}</p>
                    {admission.nurse.email && (
                      <p className="text-xs text-muted-foreground">{admission.nurse.email}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {admission.medical_officer && (
              <InfoItem label="Medical Officer" value={admission.medical_officer} className="mt-4" />
            )}
            {admission.attending_doctor_name && (
              <InfoItem label="Attending Doctor" value={admission.attending_doctor_name} className="mt-4" />
            )}
          </CardContent>
        </Card>

        {/* Medical Assessment */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Medical Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem label="Initial Diagnosis" value={admission.initial_diagnosis} />
            {admission.drug_allergy_noted && (
              <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <p className="text-xs text-amber-600 font-medium">Drug Allergies</p>
                <p className="text-sm">{admission.drug_allergy_noted}</p>
              </div>
            )}
            <InfoItem label="Remarks" value={admission.remarks} />
          </CardContent>
        </Card>

        {/* Discharge Information (if discharged) */}
        {(admission.status === "discharged" || admission.discharge_date) && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Discharge Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoItem label="Discharge Date" value={formatDateTime(admission.discharge_date, admission.discharge_time)} />
                <InfoItem label="Discharge Type" value={admission.discharge_type} />
                <InfoItem label="Discharge Status" value={admission.discharge_status} />
                <InfoItem label="Follow-up Date" value={formatDate(admission.follow_up_date)} />
              </div>
              <div className="mt-4 space-y-4">
                <InfoItem label="Discharge Diagnosis" value={admission.discharge_diagnosis} />
                {admission.other_diagnosis && (
                  <InfoItem label="Other Diagnosis" value={admission.other_diagnosis} />
                )}
                {admission.clinician_summary && (
                  <InfoItem label="Clinician Summary" value={admission.clinician_summary} />
                )}
                {admission.surgical_procedure && (
                  <InfoItem label="Surgical Procedure" value={admission.surgical_procedure} />
                )}
                {admission.discharge_instructions && (
                  <InfoItem label="Discharge Instructions" value={admission.discharge_instructions} />
                )}
                {admission.follow_up_instructions && (
                  <InfoItem label="Follow-up Instructions" value={admission.follow_up_instructions} />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Death Information (if deceased) */}
        {admission.status === "deceased" && admission.cause_of_death && (
          <Card className="lg:col-span-2 border-destructive/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <Skull className="h-4 w-4" />
                Death Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoItem label="Cause of Death" value={admission.cause_of_death} className="sm:col-span-2" />
                <InfoItem label="Time of Death" value={admission.time_of_death} />
                <InfoItem label="Autopsy" value={admission.autopsy} />
                <InfoItem label="Certified By" value={admission.certified_by} />
                <InfoItem label="Approved By" value={admission.approved_by} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Treatment Records */}
      {admission.treatment_records && admission.treatment_records.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Treatment Records ({admission.treatment_records.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTreatmentRecordsOpen(!isTreatmentRecordsOpen)}
                className="h-8 w-8 p-0"
              >
                {isTreatmentRecordsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {isTreatmentRecordsOpen && (
            <CardContent>
              <div className="space-y-4">
              {admission.treatment_records.map((record) => (
                <div
                  key={record.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm">{record.treatment_name || "Treatment"}</h4>
                        {record.treatment_type && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {record.treatment_type}
                          </Badge>
                        )}
                        {record.outcome && (
                          <Badge
                            variant={
                              record.outcome === "completed"
                                ? "default"
                                : record.outcome === "ongoing"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs capitalize"
                          >
                            {record.outcome}
                          </Badge>
                        )}
                      </div>
                      {record.description && (
                        <p className="text-sm text-muted-foreground mb-2">{record.description}</p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {record.treatment_date && (
                        <div>
                          {formatDateTime(record.treatment_date, record.treatment_time)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {record.medications && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Medications</p>
                        <p className="font-medium">{record.medications}</p>
                      </div>
                    )}
                    {record.dosage && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Dosage</p>
                        <p className="font-medium">{record.dosage}</p>
                      </div>
                    )}
                    {record.results && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Results</p>
                        <p>{record.results}</p>
                      </div>
                    )}
                    {record.findings && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Findings</p>
                        <p>{record.findings}</p>
                      </div>
                    )}
                    {record.notes && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Notes</p>
                        <p>{record.notes}</p>
                      </div>
                    )}
                    {record.pre_procedure_notes && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Pre-Procedure Notes</p>
                        <p>{record.pre_procedure_notes}</p>
                      </div>
                    )}
                    {record.post_procedure_notes && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Post-Procedure Notes</p>
                        <p>{record.post_procedure_notes}</p>
                      </div>
                    )}
                    {record.complications && (
                      <div className="md:col-span-2">
                        <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                          <p className="text-xs text-amber-600 font-medium mb-1">Complications</p>
                          <p className="text-sm">{record.complications}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {(record.doctor || record.nurse) && (
                    <div className="flex flex-wrap gap-4 pt-2 border-t text-xs">
                      {record.doctor && (
                        <span className="text-muted-foreground">
                          Doctor: <span className="font-medium">{record.doctor.name}</span>
                        </span>
                      )}
                      {record.nurse && (
                        <span className="text-muted-foreground">
                          Nurse: <span className="font-medium">{record.nurse.name}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Timestamps */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-4 border-t">
        {admission.created_at && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Created: {formatDate(admission.created_at)}
          </span>
        )}
        {admission.updated_at && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Updated: {formatDate(admission.updated_at)}
          </span>
        )}
        {admission.treatment_records_count !== undefined && admission.treatment_records_count > 0 && (
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {admission.treatment_records_count} treatment record(s)
          </span>
        )}
      </div>
    </div>
  );
}

