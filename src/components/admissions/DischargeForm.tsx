"use client";

import { useState } from "react";
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
import { Loader2, AlertCircle, LogOut } from "lucide-react";
import type { DischargeFormDTO } from "@/core/application/dtos/AdmissionDTO";
import type { AdmissionDetailDTO } from "@/core/application/dtos/AdmissionDTO";

// Helper component for labels with required indicator
const FormLabel = ({
  htmlFor,
  children,
  required = false,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) => {
  return (
    <Label htmlFor={htmlFor} className="flex items-center gap-1">
      {children}
      {required && (
        <span className="text-destructive font-semibold" aria-label="required">
          *
        </span>
      )}
    </Label>
  );
};

interface DischargeFormProps {
  admission: AdmissionDetailDTO;
  onSubmit: (data: DischargeFormDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const DISCHARGE_TYPES = [
  { value: "normal", label: "Normal Discharge" },
  { value: "against_advice", label: "Against Medical Advice" },
  { value: "absconded", label: "Absconded" },
  { value: "transferred", label: "Transferred" },
];

const DISCHARGE_STATUSES = [
  { value: "improved", label: "Improved" },
  { value: "unchanged", label: "Unchanged" },
  { value: "worse", label: "Worse" },
];

export function DischargeForm({
  admission,
  onSubmit,
  onCancel,
  isLoading = false,
}: DischargeFormProps) {
  const [formData, setFormData] = useState<DischargeFormDTO>({
    discharge_type: "normal",
    discharge_status: "improved",
    discharge_diagnosis: admission.initial_diagnosis || "",
    clinician_summary: "",
    discharge_instructions: "",
    follow_up_instructions: "",
    follow_up_date: "",
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleChange = (field: keyof DischargeFormDTO, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation errors when user makes changes
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  // Validation helper
  const validateRequiredFields = (): string[] => {
    const errors: string[] = [];

    if (!formData.discharge_type) {
      errors.push("Discharge Type is required");
    }
    if (!formData.discharge_status) {
      errors.push("Discharge Status is required");
    }
    if (!formData.discharge_diagnosis?.trim()) {
      errors.push("Discharge Diagnosis is required");
    }
    if (!formData.clinician_summary?.trim()) {
      errors.push("Clinician Summary is required");
    }
    if (!formData.discharge_instructions?.trim()) {
      errors.push("Discharge Instructions is required");
    }
    if (!formData.follow_up_instructions?.trim()) {
      errors.push("Follow-up Instructions is required");
    }
    if (!formData.follow_up_date) {
      errors.push("Follow-up Date is required");
    }

    return errors;
  };

  // Helper to check if all required fields are filled
  const isFormValid = (): boolean => {
    const errors = validateRequiredFields();
    return errors.length === 0;
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
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
        <div className="p-2 rounded-full bg-primary/10">
          <LogOut className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Discharge Patient</h3>
          <p className="text-sm text-muted-foreground">
            {admission.admission_number} - {admission.patient?.name}
          </p>
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
              All Fields Required
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              All fields marked with{" "}
              <span className="text-destructive font-semibold">*</span> are
              required for discharge documentation.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormLabel htmlFor="discharge_type" required>
            Discharge Type
          </FormLabel>
          <Select
            value={formData.discharge_type}
            onValueChange={(value) => handleChange("discharge_type", value as DischargeFormDTO["discharge_type"])}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {DISCHARGE_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <FormLabel htmlFor="discharge_status" required>
            Discharge Status
          </FormLabel>
          <Select
            value={formData.discharge_status}
            onValueChange={(value) => handleChange("discharge_status", value as DischargeFormDTO["discharge_status"])}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {DISCHARGE_STATUSES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <FormLabel htmlFor="discharge_diagnosis" required>
            Discharge Diagnosis
          </FormLabel>
          <Textarea
            id="discharge_diagnosis"
            value={formData.discharge_diagnosis || ""}
            onChange={(e) => handleChange("discharge_diagnosis", e.target.value)}
            placeholder="Final diagnosis at discharge"
            required
            className="mt-1.5"
            rows={2}
          />
        </div>

        <div className="md:col-span-2">
          <FormLabel htmlFor="clinician_summary" required>
            Clinician Summary
          </FormLabel>
          <Textarea
            id="clinician_summary"
            value={formData.clinician_summary || ""}
            onChange={(e) => handleChange("clinician_summary", e.target.value)}
            placeholder="Summary of patient's stay and treatment"
            required
            className="mt-1.5"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <FormLabel htmlFor="discharge_instructions" required>
            Discharge Instructions
          </FormLabel>
          <Textarea
            id="discharge_instructions"
            value={formData.discharge_instructions || ""}
            onChange={(e) => handleChange("discharge_instructions", e.target.value)}
            placeholder="Instructions for patient (medications, care, etc.)"
            required
            className="mt-1.5"
            rows={3}
          />
        </div>

        <div>
          <FormLabel htmlFor="follow_up_instructions" required>
            Follow-up Instructions
          </FormLabel>
          <Textarea
            id="follow_up_instructions"
            value={formData.follow_up_instructions || ""}
            onChange={(e) => handleChange("follow_up_instructions", e.target.value)}
            placeholder="Follow-up care instructions"
            required
            className="mt-1.5"
            rows={2}
          />
        </div>

        <div>
          <FormLabel htmlFor="follow_up_date" required>
            Follow-up Date
          </FormLabel>
          <Input
            id="follow_up_date"
            type="date"
            value={formData.follow_up_date || ""}
            onChange={(e) => handleChange("follow_up_date", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
            className="mt-1.5"
          />
        </div>
      </div>

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
          Discharge Patient
        </Button>
      </div>
    </form>
  );
}


