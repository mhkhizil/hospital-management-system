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

  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleChange = (field: keyof ConfirmDeathFormDTO, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.cause_of_death.trim()) {
      setValidationError("Cause of death is required");
      return;
    }

    if (!confirmed) {
      setValidationError("Please confirm this action by checking the confirmation box");
      return;
    }

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

      {/* Validation Error */}
      {validationError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {validationError}
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="cause_of_death">Cause of Death *</Label>
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
          <Label htmlFor="time_of_death">Time of Death</Label>
          <Input
            id="time_of_death"
            type="datetime-local"
            value={formData.time_of_death || ""}
            onChange={(e) => handleChange("time_of_death", e.target.value)}
            max={new Date().toISOString().slice(0, 16)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="autopsy">Autopsy</Label>
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
          <Label htmlFor="certified_by">Certified By</Label>
          <Input
            id="certified_by"
            value={formData.certified_by || ""}
            onChange={(e) => handleChange("certified_by", e.target.value)}
            placeholder="Name of certifying doctor"
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
          disabled={isLoading || !confirmed}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm Death
        </Button>
      </div>
    </form>
  );
}


