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

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (field: keyof DischargeFormDTO, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate required fields
    if (!formData.discharge_type) {
      setValidationError("Discharge type is required");
      return;
    }
    if (!formData.discharge_status) {
      setValidationError("Discharge status is required");
      return;
    }

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

      {/* Validation Error */}
      {validationError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {validationError}
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="discharge_type">Discharge Type *</Label>
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
          <Label htmlFor="discharge_status">Discharge Status *</Label>
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
          <Label htmlFor="discharge_diagnosis">Discharge Diagnosis</Label>
          <Textarea
            id="discharge_diagnosis"
            value={formData.discharge_diagnosis || ""}
            onChange={(e) => handleChange("discharge_diagnosis", e.target.value)}
            placeholder="Final diagnosis at discharge"
            className="mt-1.5"
            rows={2}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="clinician_summary">Clinician Summary</Label>
          <Textarea
            id="clinician_summary"
            value={formData.clinician_summary || ""}
            onChange={(e) => handleChange("clinician_summary", e.target.value)}
            placeholder="Summary of patient's stay and treatment"
            className="mt-1.5"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="discharge_instructions">Discharge Instructions</Label>
          <Textarea
            id="discharge_instructions"
            value={formData.discharge_instructions || ""}
            onChange={(e) => handleChange("discharge_instructions", e.target.value)}
            placeholder="Instructions for patient (medications, care, etc.)"
            className="mt-1.5"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="follow_up_instructions">Follow-up Instructions</Label>
          <Textarea
            id="follow_up_instructions"
            value={formData.follow_up_instructions || ""}
            onChange={(e) => handleChange("follow_up_instructions", e.target.value)}
            placeholder="Follow-up care instructions"
            className="mt-1.5"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="follow_up_date">Follow-up Date</Label>
          <Input
            id="follow_up_date"
            type="date"
            value={formData.follow_up_date || ""}
            onChange={(e) => handleChange("follow_up_date", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
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
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Discharge Patient
        </Button>
      </div>
    </form>
  );
}



