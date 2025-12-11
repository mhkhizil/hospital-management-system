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
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { AddressSelector } from "@/components/common/AddressSelector";
import { useAddress } from "@/core/presentation/hooks/useAddress";
import type {
  AdmissionDetailDTO,
  AdmissionFormDTO,
} from "@/core/application/dtos/AdmissionDTO";
import type { Staff } from "@/core/domain/entities/Staff";
import type { AddressComponents } from "@/core/domain/entities/Address";

interface AdmissionEditFormProps {
  admission: AdmissionDetailDTO;
  doctors: Staff[];
  nurses: Staff[];
  onSubmit: (data: Partial<AdmissionFormDTO>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  canEditAdmin?: boolean; // Can edit administrative fields (root_user, admission)
}

const POLICE_CASE_OPTIONS = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
];

export function AdmissionEditForm({
  admission,
  doctors,
  nurses,
  onSubmit,
  onCancel,
  isLoading = false,
  canEditAdmin = false,
}: AdmissionEditFormProps) {
  const { parseAddressJSON, toAddressJSON } = useAddress();

  const [formData, setFormData] = useState<Partial<AdmissionFormDTO>>({
    // Admin fields
    doctor_id: admission.doctor?.id,
    nurse_id: admission.nurse?.id,
    ward: admission.ward || "",
    bed_number: admission.bed_number || "",
    service: admission.service || "",
    medical_officer: admission.medical_officer || "",
    present_address: admission.present_address || "",
    admitted_for: admission.admitted_for || "",
    referred_by: admission.referred_by || "",
    police_case: admission.police_case || "no",
    // Medical fields (all roles)
    initial_diagnosis: admission.initial_diagnosis || "",
    drug_allergy_noted: admission.drug_allergy_noted || "",
    remarks: admission.remarks || "",
  });

  const [activeSection, setActiveSection] = useState<string>(
    canEditAdmin ? "admin" : "medical"
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Address state
  const [addressComponents, setAddressComponents] =
    useState<AddressComponents | null>(() =>
      parseAddressJSON(admission.present_address)
    );

  // Update address when admission changes
  useEffect(() => {
    setAddressComponents(parseAddressJSON(admission.present_address));
  }, [admission.present_address, parseAddressJSON]);

  const isOutpatient = admission.admission_type === "outpatient";
  const isDischarged = admission.status === "discharged";
  const isDeceased = admission.status === "deceased";

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

  const handleAddressChange = (address: AddressComponents | null) => {
    setAddressComponents(address);
    const addressJSON = toAddressJSON(address);
    setFormData((prev) => ({
      ...prev,
      present_address: addressJSON || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    await onSubmit(formData);
  };

  const sections = canEditAdmin
    ? [
        { id: "admin", label: "Administrative" },
        { id: "location", label: "Location" },
        { id: "staff", label: "Staff" },
        { id: "medical", label: "Medical" },
      ]
    : [{ id: "medical", label: "Medical Assessment" }];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h3 className="font-semibold text-lg">Edit Admission</h3>
          <p className="text-sm text-muted-foreground">
            {admission.admission_number} - {admission.patient?.name}
          </p>
        </div>
      </div>

      {/* Status Warning */}
      {(isDischarged || isDeceased) && (
        <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {isDeceased
              ? "This admission is marked as deceased. Only remarks can be updated."
              : "This admission is discharged. Only follow-up information can be updated."}
          </p>
        </div>
      )}

      {/* Validation Error */}
      {validationError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {validationError}
        </div>
      )}

      {/* Section Tabs */}
      {sections.length > 1 && (
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
      )}

      {/* Administrative Details (Admin only) */}
      {activeSection === "admin" && canEditAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="admitted_for">Reason for Admission</Label>
            <Textarea
              id="admitted_for"
              value={formData.admitted_for || ""}
              onChange={(e) => handleChange("admitted_for", e.target.value)}
              placeholder="Chief complaint / reason for admission"
              className="mt-1.5"
              rows={2}
              disabled={isDischarged || isDeceased}
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
              disabled={isDischarged || isDeceased}
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
              disabled={isDischarged || isDeceased}
            />
          </div>

          <div>
            <Label htmlFor="police_case">Police Case</Label>
            <Select
              value={formData.police_case || "no"}
              onValueChange={(value) => handleChange("police_case", value)}
              disabled={isDischarged || isDeceased}
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

      {/* Location (Admin only) */}
      {activeSection === "location" && canEditAdmin && (
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
                <Label htmlFor="ward">Ward</Label>
                <Input
                  id="ward"
                  value={formData.ward || ""}
                  onChange={(e) => handleChange("ward", e.target.value)}
                  placeholder="e.g., Ward A, ICU"
                  className="mt-1.5"
                  disabled={isDischarged || isDeceased}
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
                  disabled={isDischarged || isDeceased}
                />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <AddressSelector
              value={addressComponents}
              onChange={handleAddressChange}
              label="Present Address"
              disabled={isDischarged || isDeceased}
            />
          </div>
        </div>
      )}

      {/* Staff Assignment (Admin only) */}
      {activeSection === "staff" && canEditAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="doctor_id">Assigned Doctor</Label>
            <Select
              value={formData.doctor_id?.toString() || ""}
              onValueChange={(value) =>
                handleChange("doctor_id", value ? parseInt(value) : undefined)
              }
              disabled={isDischarged || isDeceased}
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
              disabled={isDischarged || isDeceased}
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
              disabled={isDischarged || isDeceased}
            />
          </div>
        </div>
      )}

      {/* Medical Assessment (All roles) */}
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
              disabled={isDeceased}
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
              placeholder="Known drug allergies"
              className="mt-1.5"
              disabled={isDeceased}
            />
          </div>

          <div>
            <Label htmlFor="remarks">Remarks / Progress Notes</Label>
            <Textarea
              id="remarks"
              value={formData.remarks || ""}
              onChange={(e) => handleChange("remarks", e.target.value)}
              placeholder="Additional remarks or progress notes"
              className="mt-1.5"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Can be updated even after discharge for minor corrections
            </p>
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
          Save Changes
        </Button>
      </div>
    </form>
  );
}
