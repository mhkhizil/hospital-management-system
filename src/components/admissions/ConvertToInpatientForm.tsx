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
import { Loader2, AlertCircle, Repeat } from "lucide-react";
import { useWards } from "@/core/presentation/hooks/useWards";
import type { ConvertToInpatientFormDTO } from "@/core/application/dtos/AdmissionDTO";
import type { AdmissionDetailDTO } from "@/core/application/dtos/AdmissionDTO";

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

interface ConvertToInpatientFormProps {
  admission: AdmissionDetailDTO;
  onSubmit: (data: ConvertToInpatientFormDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConvertToInpatientForm({
  admission,
  onSubmit,
  onCancel,
  isLoading = false,
}: ConvertToInpatientFormProps) {
  const {
    wardOptions,
    getRoomOptionsForWard,
    isLoading: isLoadingWards,
  } = useWards();

  const [formData, setFormData] = useState<ConvertToInpatientFormDTO>({
    ward: "",
    bed_number: "",
    admission_time: new Date().toTimeString().slice(0, 5),
    remarks: "",
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleChange = (
    field: keyof ConvertToInpatientFormDTO,
    value: string
  ) => {
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

    if (!formData.ward?.trim()) {
      errors.push("Ward is required");
    }
    if (!formData.bed_number?.trim()) {
      errors.push("Room Number is required");
    }
    if (!formData.admission_time?.trim()) {
      errors.push("Admission Time is required");
    }
    if (!formData.remarks?.trim()) {
      errors.push("Remarks is required");
    }

    return errors;
  };

  // Helper to check if all required fields are filled
  const isFormValid = (): boolean => {
    return (
      !!(formData.ward || "").trim() &&
      !!(formData.bed_number || "").trim() &&
      !!(formData.admission_time || "").trim() &&
      !!(formData.remarks || "").trim()
    );
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
          <Repeat className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Convert to Inpatient</h3>
          <p className="text-sm text-muted-foreground">
            {admission.admission_number} - {admission.patient?.name}
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          This outpatient visit will be converted to an inpatient admission. The
          patient will be assigned to a ward and bed.
        </p>
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
              required for converting to inpatient admission.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="md:col-span-2">
          <FormLabel htmlFor="remarks" required>
            Remarks
          </FormLabel>
          <Textarea
            id="remarks"
            value={formData.remarks || ""}
            onChange={(e) => handleChange("remarks", e.target.value)}
            placeholder="Reason for conversion or additional notes"
            required
            className="mt-1.5"
            rows={3}
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
          Convert to Inpatient
        </Button>
      </div>
    </form>
  );
}
