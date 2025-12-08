"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import type { AdmissionFormDTO } from "@/core/application/dtos/AdmissionDTO";
import type { Staff } from "@/core/domain/entities/Staff";
import type { PatientListDTO } from "@/core/application/dtos/PatientDTO";

interface AdmissionFormProps {
  patient: PatientListDTO;
  doctors: Staff[];
  nurses: Staff[];
  onSubmit: (data: AdmissionFormDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ADMISSION_TYPES = [
  { value: "outpatient", label: "Outpatient Visit" },
  { value: "inpatient", label: "Inpatient Admission" },
];

const POLICE_CASE_OPTIONS = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
];

export function AdmissionForm({
  patient,
  doctors,
  nurses,
  onSubmit,
  onCancel,
  isLoading = false,
}: AdmissionFormProps) {
  const [formData, setFormData] = useState<AdmissionFormDTO>({
    admission_type: "inpatient",
    admission_date: new Date().toISOString().split("T")[0],
    admission_time: new Date().toTimeString().slice(0, 5),
    admitted_for: "",
    doctor_id: undefined,
    nurse_id: undefined,
    present_address: "",
    referred_by: "",
    police_case: "no",
    service: "",
    ward: "",
    bed_number: "",
    medical_officer: "",
    initial_diagnosis: "",
    drug_allergy_noted: patient.current_admission?.drug_allergy_noted || "",
    remarks: "",
  });

  const [activeSection, setActiveSection] = useState<string>("basic");
  const [validationError, setValidationError] = useState<string | null>(null);

  const isOutpatient = formData.admission_type === "outpatient";

  // Clear ward/bed when switching to outpatient
  useEffect(() => {
    if (isOutpatient) {
      setFormData((prev) => ({
        ...prev,
        ward: "",
        bed_number: "",
      }));
    }
  }, [isOutpatient]);

  const handleChange = (
    field: keyof AdmissionFormDTO,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : value,
    }));
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate required fields
    if (!formData.admission_date) {
      setValidationError("Admission date is required");
      return;
    }
    if (!formData.admitted_for?.trim()) {
      setValidationError("Reason for admission is required");
      return;
    }
    if (!isOutpatient && !formData.ward?.trim()) {
      setValidationError("Ward is required for inpatient admissions");
      return;
    }

    await onSubmit(formData);
  };

  const sections = [
    { id: "basic", label: "Basic Info" },
    { id: "location", label: "Location" },
    { id: "staff", label: "Staff" },
    { id: "medical", label: "Medical" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Info Banner */}
      <div className="bg-muted/50 rounded-lg p-4 border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Admitting Patient</p>
            <p className="font-semibold text-lg">{patient.name}</p>
            <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
              {patient.nrc_number && <span>NRC: {patient.nrc_number}</span>}
              {patient.age && <span>Age: {patient.age}</span>}
              {patient.sex && <span className="capitalize">{patient.sex}</span>}
            </div>
          </div>
          {patient.contact_phone && (
            <div className="text-sm">
              <span className="text-muted-foreground">Phone: </span>
              {patient.contact_phone}
            </div>
          )}
        </div>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {validationError}
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === section.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Basic Information */}
      {activeSection === "basic" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="admission_type">Admission Type *</Label>
            <Select
              value={formData.admission_type}
              onValueChange={(value) => handleChange("admission_type", value)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {ADMISSION_TYPES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="admission_date">Admission Date *</Label>
            <Input
              id="admission_date"
              type="date"
              value={formData.admission_date}
              onChange={(e) => handleChange("admission_date", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="admission_time">Admission Time</Label>
            <Input
              id="admission_time"
              type="time"
              value={formData.admission_time || ""}
              onChange={(e) => handleChange("admission_time", e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="service">Service / Department</Label>
            <Input
              id="service"
              value={formData.service || ""}
              onChange={(e) => handleChange("service", e.target.value)}
              placeholder="e.g., Cardiology, Surgery"
              className="mt-1.5"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="admitted_for">Reason for Admission *</Label>
            <Textarea
              id="admitted_for"
              value={formData.admitted_for}
              onChange={(e) => handleChange("admitted_for", e.target.value)}
              placeholder="Chief complaint / reason for admission"
              required
              className="mt-1.5"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Location */}
      {activeSection === "location" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isOutpatient ? (
            <div className="md:col-span-2 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Ward and bed assignment is not applicable for outpatient visits.
              </p>
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="ward">Ward *</Label>
                <Input
                  id="ward"
                  value={formData.ward || ""}
                  onChange={(e) => handleChange("ward", e.target.value)}
                  placeholder="e.g., Ward A, ICU"
                  required={!isOutpatient}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="bed_number">Bed Number</Label>
                <Input
                  id="bed_number"
                  value={formData.bed_number || ""}
                  onChange={(e) => handleChange("bed_number", e.target.value)}
                  placeholder="e.g., 12, A-15"
                  className="mt-1.5"
                />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <Label htmlFor="present_address">Present Address</Label>
            <Textarea
              id="present_address"
              value={formData.present_address || ""}
              onChange={(e) => handleChange("present_address", e.target.value)}
              placeholder="Current address at time of admission"
              className="mt-1.5"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="referred_by">Referred By</Label>
            <Input
              id="referred_by"
              value={formData.referred_by || ""}
              onChange={(e) => handleChange("referred_by", e.target.value)}
              placeholder="Referring doctor or hospital"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="police_case">Police Case</Label>
            <Select
              value={formData.police_case || "no"}
              onValueChange={(value) => handleChange("police_case", value)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POLICE_CASE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Staff Assignment */}
      {activeSection === "staff" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="doctor_id">Assigned Doctor</Label>
            <Select
              value={formData.doctor_id?.toString() || ""}
              onValueChange={(value) =>
                handleChange("doctor_id", value ? parseInt(value) : undefined)
              }
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id.toString()}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="nurse_id">Assigned Nurse</Label>
            <Select
              value={formData.nurse_id?.toString() || ""}
              onValueChange={(value) =>
                handleChange("nurse_id", value ? parseInt(value) : undefined)
              }
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select nurse" />
              </SelectTrigger>
              <SelectContent>
                {nurses.map((nurse) => (
                  <SelectItem key={nurse.id} value={nurse.id.toString()}>
                    {nurse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="medical_officer">Medical Officer</Label>
            <Input
              id="medical_officer"
              value={formData.medical_officer || ""}
              onChange={(e) => handleChange("medical_officer", e.target.value)}
              placeholder="Name of medical officer"
              className="mt-1.5"
            />
          </div>
        </div>
      )}

      {/* Medical Information */}
      {activeSection === "medical" && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="initial_diagnosis">Initial Diagnosis</Label>
            <Textarea
              id="initial_diagnosis"
              value={formData.initial_diagnosis || ""}
              onChange={(e) =>
                handleChange("initial_diagnosis", e.target.value)
              }
              placeholder="Initial diagnosis / assessment"
              className="mt-1.5"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="drug_allergy_noted">Drug Allergies</Label>
            <Input
              id="drug_allergy_noted"
              value={formData.drug_allergy_noted || ""}
              onChange={(e) =>
                handleChange("drug_allergy_noted", e.target.value)
              }
              placeholder="Known drug allergies (comma-separated)"
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Pre-filled from patient record if available
            </p>
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks || ""}
              onChange={(e) => handleChange("remarks", e.target.value)}
              placeholder="Additional remarks or notes"
              className="mt-1.5"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isOutpatient ? "Create Visit" : "Admit Patient"}
        </Button>
      </div>
    </form>
  );
}
