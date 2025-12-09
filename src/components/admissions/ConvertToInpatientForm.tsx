"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle, Repeat } from "lucide-react";
import type { ConvertToInpatientFormDTO } from "@/core/application/dtos/AdmissionDTO";
import type { AdmissionDetailDTO } from "@/core/application/dtos/AdmissionDTO";

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
  const [formData, setFormData] = useState<ConvertToInpatientFormDTO>({
    ward: "",
    bed_number: "",
    admission_time: new Date().toTimeString().slice(0, 5),
    remarks: "",
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (field: keyof ConvertToInpatientFormDTO, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.ward.trim()) {
      setValidationError("Ward is required for inpatient admission");
      return;
    }

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
          This outpatient visit will be converted to an inpatient admission. 
          The patient will be assigned to a ward and bed.
        </p>
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
          <Label htmlFor="ward">Ward *</Label>
          <Input
            id="ward"
            value={formData.ward}
            onChange={(e) => handleChange("ward", e.target.value)}
            placeholder="e.g., Ward A, ICU"
            required
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

        <div className="md:col-span-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={formData.remarks || ""}
            onChange={(e) => handleChange("remarks", e.target.value)}
            placeholder="Reason for conversion or additional notes"
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
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Convert to Inpatient
        </Button>
      </div>
    </form>
  );
}



