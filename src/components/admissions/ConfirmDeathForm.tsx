"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle, Skull, AlertTriangle } from "lucide-react";
import type { ConfirmDeathFormDTO } from "@/core/application/dtos/AdmissionDTO";
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

interface ConfirmDeathFormProps {
  admission: AdmissionDetailDTO;
  onSubmit: (data: ConfirmDeathFormDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const AUTOPSY_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export function ConfirmDeathForm({
  admission,
  onSubmit,
  onCancel,
  isLoading = false,
}: ConfirmDeathFormProps) {
  const [formData, setFormData] = useState<ConfirmDeathFormDTO>({
    cause_of_death: "",
    autopsy: "pending",
    time_of_death: new Date().toISOString().slice(0, 16),
    certified_by: "",
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const handleChange = (field: keyof ConfirmDeathFormDTO, value: string) => {
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

    if (!formData.cause_of_death?.trim()) {
      errors.push("Cause of Death is required");
    }
    if (!formData.time_of_death) {
      errors.push("Time of Death is required");
    }
    if (!formData.autopsy) {
      errors.push("Autopsy status is required");
    }
    if (!formData.certified_by?.trim()) {
      errors.push("Certified By is required");
    }
    if (!confirmed) {
      errors.push("Please confirm this action by checking the confirmation box");
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
      <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
        <div className="p-2 rounded-full bg-destructive/20">
          <Skull className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-semibold text-destructive">Confirm Patient Death</h3>
          <p className="text-sm text-muted-foreground">
            {admission.admission_number} - {admission.patient?.name}
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">This action is irreversible</p>
            <p className="text-sm text-muted-foreground mt-1">
              Confirming death will permanently close this admission and mark the patient as deceased.
              The patient will not be able to be admitted again.
            </p>
          </div>
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
              required for death confirmation documentation.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormLabel htmlFor="cause_of_death" required>
            Cause of Death
          </FormLabel>
          <Input
            id="cause_of_death"
            value={formData.cause_of_death}
            onChange={(e) => handleChange("cause_of_death", e.target.value)}
            placeholder="Medical cause of death"
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <FormLabel htmlFor="time_of_death" required>
            Time of Death
          </FormLabel>
          <Input
            id="time_of_death"
            type="datetime-local"
            value={formData.time_of_death || ""}
            onChange={(e) => handleChange("time_of_death", e.target.value)}
            max={new Date().toISOString().slice(0, 16)}
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <FormLabel htmlFor="autopsy" required>
            Autopsy
          </FormLabel>
          <Select
            value={formData.autopsy || "pending"}
            onValueChange={(value) => handleChange("autopsy", value)}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {AUTOPSY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <FormLabel htmlFor="certified_by" required>
            Certified By
          </FormLabel>
          <Input
            id="certified_by"
            value={formData.certified_by || ""}
            onChange={(e) => handleChange("certified_by", e.target.value)}
            placeholder="Name of certifying doctor"
            required
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border">
        <input
          type="checkbox"
          id="confirm"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="confirm" className="text-sm">
          I confirm that I have verified the patient's death and understand that this action cannot be undone.
          This will permanently mark the patient as deceased.
        </label>
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
        <Button 
          type="submit" 
          variant="destructive" 
          disabled={isLoading || !isFormValid()}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm Death
        </Button>
      </div>
    </form>
  );
}


