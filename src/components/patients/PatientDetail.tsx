"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Phone,
  MapPin,
  Heart,
  Users,
  FileText,
  Calendar,
  Droplets,
  AlertTriangle,
  Activity,
  X,
  Edit2,
  Loader2,
  Building2,
  Stethoscope,
  Bed,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Eye,
} from "lucide-react";
import type {
  PatientDetailDTO,
  AdmissionDTO,
} from "@/core/application/dtos/PatientDTO";

interface PatientDetailProps {
  patient: PatientDetailDTO;
  admissions?: AdmissionDTO[];
  onClose: () => void;
  onEdit?: () => void;
  onViewAdmission?: (admissionId: number) => void;
  canEdit?: boolean;
  isLoadingAdmissions?: boolean;
}

interface InfoItemProps {
  label: string;
  value: string | number | null | undefined;
  icon?: React.ReactNode;
  className?: string;
}

function InfoItem({ label, value, icon, className }: InfoItemProps) {
  if (value === null || value === undefined || value === "") return null;

  return (
    <div className={`flex items-start gap-3 ${className || ""}`}>
      {icon && (
        <div className="text-muted-foreground mt-0.5 shrink-0">{icon}</div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{String(value)}</p>
      </div>
    </div>
  );
}

function AdmissionCard({
  admission,
  formatDate,
  formatDateTime,
  onViewAdmission,
}: {
  admission: AdmissionDTO;
  formatDate: (d: string | null | undefined) => string | null;
  formatDateTime: (
    d: string | null | undefined,
    t: string | null | undefined
  ) => string | null;
  onViewAdmission?: (admissionId: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "admitted":
        return "default";
      case "discharged":
        return "secondary";
      case "transferred":
        return "outline";
      default:
        return "outline";
    }
  };

  const getBillingBadgeVariant = (status: string | undefined) => {
    switch (status) {
      case "paid":
        return "default";
      case "partial":
        return "secondary";
      case "pending":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="rounded-lg border bg-card">
      {/* Header - Always visible */}
      <div
        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold">
                {admission.admission_number}
              </span>
              <Badge variant={getStatusBadgeVariant(admission.status)}>
                {admission.status}
              </Badge>
              {admission.admission_type && (
                <Badge variant="outline" className="capitalize">
                  {admission.admission_type}
                </Badge>
              )}
              {admission.billing_status && (
                <Badge
                  variant={getBillingBadgeVariant(admission.billing_status)}
                  className="capitalize"
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  {admission.billing_status}
                </Badge>
              )}
            </div>
            {admission.admitted_for && (
              <p className="text-sm text-muted-foreground mt-1">
                {admission.admitted_for}
              </p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
              {admission.admission_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDateTime(
                    admission.admission_date,
                    admission.admission_time
                  )}
                </span>
              )}
              {admission.service && (
                <span className="flex items-center gap-1">
                  <Stethoscope className="h-3 w-3" />
                  {admission.service}
                </span>
              )}
              {admission.ward && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {admission.ward}
                  {admission.bed_number && ` - Bed ${admission.bed_number}`}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onViewAdmission && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewAdmission(admission.id);
                }}
                className="h-8"
              >
                <Eye className="h-3 w-3 mr-1.5" />
                Go to Admission
              </Button>
            )}
            <Button variant="ghost" size="icon" className="shrink-0">
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t px-4 py-4 space-y-6">
          {/* Admission Info */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Admission Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                label="Admission Date"
                value={formatDateTime(
                  admission.admission_date,
                  admission.admission_time
                )}
              />
              <InfoItem
                label="Admission Type"
                value={admission.admission_type}
              />
              <InfoItem label="Service/Department" value={admission.service} />
              <InfoItem label="Ward" value={admission.ward} />
              <InfoItem label="Bed Number" value={admission.bed_number} />
              <InfoItem
                label="Present Address"
                value={admission.present_address}
              />
              <InfoItem label="Referred By" value={admission.referred_by} />
              <InfoItem label="Police Case" value={admission.police_case} />
              <InfoItem
                label="Medical Officer"
                value={admission.medical_officer}
              />
            </div>
          </div>

          {/* Diagnosis */}
          {(admission.initial_diagnosis ||
            admission.drug_allergy_noted ||
            admission.remarks) && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Initial Assessment
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <InfoItem
                  label="Initial Diagnosis"
                  value={admission.initial_diagnosis}
                />
                {admission.drug_allergy_noted && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Drug Allergy Noted
                      </p>
                      <p className="text-sm font-medium text-destructive">
                        {admission.drug_allergy_noted}
                      </p>
                    </div>
                  </div>
                )}
                <InfoItem label="Remarks" value={admission.remarks} />
              </div>
            </div>
          )}

          {/* Staff */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Assigned Staff
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {admission.doctor_name && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Stethoscope className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Doctor</p>
                    <p className="text-sm font-medium">
                      {admission.doctor_name}
                    </p>
                    {admission.doctor_email && (
                      <p className="text-xs text-muted-foreground">
                        {admission.doctor_email}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {admission.nurse_name && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-full bg-green-500/10">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nurse</p>
                    <p className="text-sm font-medium">
                      {admission.nurse_name}
                    </p>
                    {admission.nurse_email && (
                      <p className="text-xs text-muted-foreground">
                        {admission.nurse_email}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {admission.attending_doctor_name && (
                <InfoItem
                  label="Attending Doctor"
                  value={admission.attending_doctor_name}
                />
              )}
            </div>
          </div>

          {/* Discharge Info (if discharged) */}
          {admission.status === "discharged" && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Discharge Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoItem
                  label="Discharge Date"
                  value={formatDateTime(
                    admission.discharge_date,
                    admission.discharge_time
                  )}
                />
                <InfoItem
                  label="Discharge Type"
                  value={admission.discharge_type}
                />
                <InfoItem
                  label="Discharge Status"
                  value={admission.discharge_status}
                />
                <InfoItem
                  label="Discharge Diagnosis"
                  value={admission.discharge_diagnosis}
                  className="sm:col-span-2 lg:col-span-3"
                />
                {admission.other_diagnosis && (
                  <InfoItem
                    label="Other Diagnosis"
                    value={admission.other_diagnosis}
                    className="sm:col-span-2 lg:col-span-3"
                  />
                )}
                {admission.external_cause_of_injury && (
                  <InfoItem
                    label="External Cause of Injury"
                    value={admission.external_cause_of_injury}
                    className="sm:col-span-2 lg:col-span-3"
                  />
                )}
                {admission.clinician_summary && (
                  <InfoItem
                    label="Clinician Summary"
                    value={admission.clinician_summary}
                    className="sm:col-span-2 lg:col-span-3"
                  />
                )}
                {admission.surgical_procedure && (
                  <InfoItem
                    label="Surgical Procedure"
                    value={admission.surgical_procedure}
                    className="sm:col-span-2 lg:col-span-3"
                  />
                )}
                {admission.discharge_instructions && (
                  <InfoItem
                    label="Discharge Instructions"
                    value={admission.discharge_instructions}
                    className="sm:col-span-2 lg:col-span-3"
                  />
                )}
                {admission.follow_up_instructions && (
                  <InfoItem
                    label="Follow-up Instructions"
                    value={admission.follow_up_instructions}
                    className="sm:col-span-2 lg:col-span-3"
                  />
                )}
                <InfoItem
                  label="Follow-up Date"
                  value={formatDate(admission.follow_up_date)}
                />
              </div>
            </div>
          )}

          {/* Death Info (if applicable) */}
          {admission.cause_of_death && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold mb-3 text-destructive">
                Death Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  label="Cause of Death"
                  value={admission.cause_of_death}
                />
                <InfoItem
                  label="Time of Death"
                  value={admission.time_of_death}
                />
                <InfoItem label="Autopsy" value={admission.autopsy} />
                <InfoItem label="Certified By" value={admission.certified_by} />
                <InfoItem label="Approved By" value={admission.approved_by} />
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t">
            {admission.created_at && (
              <span>Created: {formatDate(admission.created_at)}</span>
            )}
            {admission.updated_at && (
              <span>Updated: {formatDate(admission.updated_at)}</span>
            )}
            {admission.treatment_records_count !== undefined &&
              admission.treatment_records_count > 0 && (
                <span>
                  {admission.treatment_records_count} treatment record(s)
                </span>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export function PatientDetail({
  patient,
  admissions = [],
  onClose,
  onEdit,
  onViewAdmission,
  canEdit = false,
  isLoadingAdmissions = false,
}: PatientDetailProps) {
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (
    dateStr: string | null | undefined,
    timeStr: string | null | undefined
  ) => {
    if (!dateStr) return null;
    const date = new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    if (timeStr) {
      return `${date} at ${timeStr}`;
    }
    return date;
  };

  const getSexDisplay = (sex: string | null) => {
    if (!sex) return null;
    return sex.charAt(0).toUpperCase() + sex.slice(1);
  };

  const getMaritalStatusDisplay = (status: string | null) => {
    if (!status) return null;
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Use admissions from props if available, otherwise from patient
  const displayAdmissions =
    admissions.length > 0 ? admissions : patient.admissions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold truncate">{patient.name}</h2>
            <Badge
              variant={patient.admissions_count > 0 ? "default" : "secondary"}
            >
              {patient.admissions_count > 0 ? "Admitted" : "Not Admitted Yet"}
            </Badge>
          </div>
          {patient.nrc_number && (
            <p className="text-muted-foreground mt-1">
              NRC: {patient.nrc_number}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canEdit && onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Age"
                value={patient.age ? `${patient.age} years` : null}
              />
              <InfoItem label="Sex" value={getSexDisplay(patient.sex)} />
              <InfoItem
                label="Date of Birth"
                value={formatDate(patient.dob)}
                icon={<Calendar className="h-4 w-4" />}
              />
              <InfoItem
                label="Blood Type"
                value={patient.blood_type}
                icon={<Droplets className="h-4 w-4" />}
              />
            </div>
            <InfoItem
              label="Contact Phone"
              value={patient.contact_phone}
              icon={<Phone className="h-4 w-4" />}
            />
            <InfoItem
              label="Permanent Address"
              value={patient.permanent_address}
              icon={<MapPin className="h-4 w-4" />}
            />
          </CardContent>
        </Card>

        {/* Personal Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-4 w-4" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                label="Marital Status"
                value={getMaritalStatusDisplay(patient.marital_status)}
              />
              <InfoItem label="Occupation" value={patient.occupation} />
              <InfoItem label="Ethnic Group" value={patient.ethnic_group} />
              <InfoItem label="Religion" value={patient.religion} />
              <InfoItem label="Father's Name" value={patient.father_name} />
              <InfoItem label="Mother's Name" value={patient.mother_name} />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              label="Contact Name"
              value={patient.nearest_relative_name}
            />
            <InfoItem
              label="Contact Phone"
              value={patient.nearest_relative_phone}
              icon={<Phone className="h-4 w-4" />}
            />
            <InfoItem label="Relationship" value={patient.relationship} />
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {patient.known_allergies && (
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Known Allergies
                  </p>
                  <p className="text-sm font-medium text-destructive">
                    {patient.known_allergies}
                  </p>
                </div>
              </div>
            )}
            {patient.chronic_conditions && (
              <div className="flex items-start gap-3">
                <Activity className="h-4 w-4 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Chronic Conditions
                  </p>
                  <p className="text-sm font-medium">
                    {patient.chronic_conditions}
                  </p>
                </div>
              </div>
            )}
            {!patient.known_allergies && !patient.chronic_conditions && (
              <p className="text-sm text-muted-foreground">
                No medical information recorded
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admission History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bed className="h-4 w-4" />
            Admission History ({patient.admissions_count} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingAdmissions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : displayAdmissions.length > 0 ? (
            <div className="space-y-4">
              {displayAdmissions.map((admission) => (
                <AdmissionCard
                  key={admission.id}
                  admission={admission}
                  formatDate={formatDate}
                  formatDateTime={formatDateTime}
                  onViewAdmission={onViewAdmission}
                />
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No admission records found
            </p>
          )}
        </CardContent>
      </Card>

      {/* Record Info */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {patient.created_at && (
          <span>Created: {formatDate(patient.created_at)}</span>
        )}
        {patient.updated_at && (
          <span>Last updated: {formatDate(patient.updated_at)}</span>
        )}
      </div>
    </div>
  );
}
