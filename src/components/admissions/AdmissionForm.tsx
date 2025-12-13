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
import { AddressSelector } from "@/components/common/AddressSelector";
import { useAddress } from "@/core/presentation/hooks/useAddress";
import { useDepartments } from "@/core/presentation/hooks/useDepartments";
import { useWards } from "@/core/presentation/hooks/useWards";
import type { AdmissionFormDTO } from "@/core/application/dtos/AdmissionDTO";
import type { Staff } from "@/core/domain/entities/Staff";
import type { PatientListDTO } from "@/core/application/dtos/PatientDTO";
import type { AddressComponents } from "@/core/domain/entities/Address";

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

// Helper component for labels with required indicator
const FormLabel = ({
  htmlFor,
  children,
  required = false,
  optional = false,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) => {
  return (
    <Label htmlFor={htmlFor} className="flex items-center gap-1">
      {children}
      {required && (
        <span className="text-destructive font-semibold" aria-label="required">
          *
        </span>
      )}
      {optional && (
        <span className="text-xs text-muted-foreground font-normal ml-1">
          (Optional)
        </span>
      )}
    </Label>
  );
};

export function AdmissionForm({
  patient,
  doctors,
  nurses,
  onSubmit,
  onCancel,
  isLoading = false,
}: AdmissionFormProps) {
  const { toAddressJSON } = useAddress();
  const { departmentOptions, isLoading: isLoadingDepartments } =
    useDepartments();
  const {
    wardOptions,
    getRoomOptionsForWard,
    isLoading: isLoadingWards,
  } = useWards();

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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof AdmissionFormDTO, string>>
  >({});

  // Validation helper function for name fields
  const validateNameField = (value: string): string | null => {
    if (!value.trim()) return null; // Empty is handled by required validation
    // Allow: letters (Unicode), spaces, hyphens, apostrophes, periods
    const namePattern = /^[\p{L}\s\-'.]+$/u;
    if (!namePattern.test(value)) {
      return "Only letters, spaces, hyphens (-), apostrophes ('), and periods (.) are allowed";
    }
    return null;
  };

  // Address state
  const [addressComponents, setAddressComponents] =
    useState<AddressComponents | null>(null);

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

    // Validate field format in real-time
    let formatError: string | null = null;
    if (typeof value === "string" && value.trim()) {
      // Name field validation
      if (field === "medical_officer") {
        formatError = validateNameField(value);
      }
    }

    // Update field errors
    setFieldErrors((prev) => ({
      ...prev,
      [field]: formatError || undefined,
    }));

    // Clear validation errors when user makes changes
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleAddressChange = (address: AddressComponents | null) => {
    setAddressComponents(address);
    const addressJSON = toAddressJSON(address);
    setFormData((prev) => ({
      ...prev,
      present_address: addressJSON || "",
    }));
  };

  // Validation helper
  const validateRequiredFields = (): string[] => {
    const errors: string[] = [];

    if (!formData.admission_type) {
      errors.push("Admission Type is required");
    }
    if (!formData.admission_date) {
      errors.push("Admission Date is required");
    }
    if (!formData.admission_time) {
      errors.push("Admission Time is required");
    }
    if (!formData.admitted_for?.trim()) {
      errors.push("Reason for Admission is required");
    }
    if (!formData.service?.trim()) {
      errors.push("Service/Department is required");
    }
    if (!formData.doctor_id) {
      errors.push("Assigned Doctor is required");
    }
    if (!formData.nurse_id) {
      errors.push("Assigned Nurse is required");
    }
    if (!formData.present_address) {
      errors.push("Present Address is required");
    }
    if (!formData.police_case) {
      errors.push("Police Case is required");
    }
    if (!formData.initial_diagnosis?.trim()) {
      errors.push("Initial Diagnosis is required");
    }

    // Conditional validation for inpatient
    if (!isOutpatient) {
      if (!formData.ward?.trim()) {
        errors.push("Ward is required for inpatient admissions");
      }
      if (!formData.bed_number?.trim()) {
        errors.push("Room Number is required for inpatient admissions");
      }
    }

    // Validate that ward/bed are NOT set for outpatient
    if (isOutpatient) {
      if (formData.ward?.trim()) {
        errors.push("Ward should not be set for outpatient visits");
      }
      if (formData.bed_number?.trim()) {
        errors.push("Room Number should not be set for outpatient visits");
      }
    }

    // Format validation
    if (formData.medical_officer?.trim()) {
      const nameError = validateNameField(formData.medical_officer);
      if (nameError) errors.push(`Medical Officer: ${nameError}`);
    }

    return errors;
  };

  // Helper to check if all required fields are filled and valid
  const isFormValid = (): boolean => {
    const errors = validateRequiredFields();
    const hasFormatErrors = Object.keys(fieldErrors).length > 0;
    return errors.length === 0 && !hasFormatErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const errors = validateRequiredFields();
    if (errors.length > 0) {
      setValidationErrors(errors);
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Clear errors if validation passes
    setValidationErrors([]);
    setFieldErrors({});
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

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive mb-2">
                Please fill in all required fields:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-destructive/90">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Required Fields Notice */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Field Requirements
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Fields marked with{" "}
              <span className="text-destructive font-semibold">*</span> are
              required. Fields labeled{" "}
              <span className="text-muted-foreground">(Optional)</span> can be
              left blank. Ward and Room Number are required for inpatient
              admissions only.
            </p>
          </div>
        </div>
      </div>

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
            <FormLabel htmlFor="admission_type" required>
              Admission Type
            </FormLabel>
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
            <FormLabel htmlFor="admission_date" required>
              Admission Date
            </FormLabel>
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
            <FormLabel htmlFor="admission_time" required>
              Admission Time
            </FormLabel>
            <Input
              id="admission_time"
              type="time"
              value={formData.admission_time || ""}
              onChange={(e) => handleChange("admission_time", e.target.value)}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <FormLabel htmlFor="service" required>
              Service / Department
            </FormLabel>
            <Select
              value={formData.service || ""}
              onValueChange={(value) => handleChange("service", value)}
              disabled={isLoadingDepartments}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue
                  placeholder={
                    isLoadingDepartments
                      ? "Loading departments..."
                      : "Select department"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <FormLabel htmlFor="admitted_for" required>
              Reason for Admission
            </FormLabel>
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
                <FormLabel htmlFor="ward" required>
                  Ward
                </FormLabel>
                <Select
                  value={formData.ward || ""}
                  onValueChange={(value) => {
                    handleChange("ward", value);
                    // Clear bed number when ward changes
                    handleChange("bed_number", "");
                  }}
                  disabled={isLoadingWards}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue
                      placeholder={
                        isLoadingWards ? "Loading wards..." : "Select ward"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {wardOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <FormLabel htmlFor="bed_number" required>
                  Room Number
                </FormLabel>
                <Select
                  value={formData.bed_number || ""}
                  onValueChange={(value) => handleChange("bed_number", value)}
                  disabled={!formData.ward || isLoadingWards}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue
                      placeholder={
                        formData.ward ? "Select room" : "Select ward first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.ward
                      ? getRoomOptionsForWard(formData.ward).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      : null}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <AddressSelector
              value={addressComponents}
              onChange={handleAddressChange}
              label="Present Address"
              required
            />
          </div>

          <div>
            <FormLabel htmlFor="referred_by" optional>
              Referred By
            </FormLabel>
            <Input
              id="referred_by"
              value={formData.referred_by || ""}
              onChange={(e) => handleChange("referred_by", e.target.value)}
              placeholder="Referring doctor or hospital"
              className="mt-1.5"
            />
          </div>

          <div>
            <FormLabel htmlFor="police_case" required>
              Police Case
            </FormLabel>
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
            <FormLabel htmlFor="doctor_id" required>
              Assigned Doctor
            </FormLabel>
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
            <FormLabel htmlFor="nurse_id" required>
              Assigned Nurse
            </FormLabel>
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
            <FormLabel htmlFor="medical_officer" optional>
              Medical Officer
            </FormLabel>
            <Input
              id="medical_officer"
              value={formData.medical_officer || ""}
              onChange={(e) => handleChange("medical_officer", e.target.value)}
              placeholder="Name of medical officer"
              className={`mt-1.5 ${
                fieldErrors.medical_officer ? "border-destructive" : ""
              }`}
            />
            {fieldErrors.medical_officer && (
              <p className="text-xs text-destructive mt-1">
                {fieldErrors.medical_officer}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Medical Information */}
      {activeSection === "medical" && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <FormLabel htmlFor="initial_diagnosis" required>
              Initial Diagnosis
            </FormLabel>
            <Textarea
              id="initial_diagnosis"
              value={formData.initial_diagnosis || ""}
              onChange={(e) =>
                handleChange("initial_diagnosis", e.target.value)
              }
              placeholder="Initial diagnosis / assessment"
              required
              className="mt-1.5"
              rows={2}
            />
          </div>

          <div>
            <FormLabel htmlFor="drug_allergy_noted" optional>
              Drug Allergies
            </FormLabel>
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
            <FormLabel htmlFor="remarks" optional>
              Remarks
            </FormLabel>
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
        <Button type="submit" disabled={isLoading || !isFormValid()}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isOutpatient ? "Create Visit" : "Admit Patient"}
        </Button>
      </div>
    </form>
  );
}
