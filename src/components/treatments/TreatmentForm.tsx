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
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import type { TreatmentFormDTO, TreatmentDetailDTO } from "@/core/application/dtos/TreatmentDTO";
import type { Staff } from "@/core/domain/entities/Staff";
import { TREATMENT_TYPES, TREATMENT_OUTCOMES } from "@/core/domain/entities/Treatment";
import type { TreatmentType, TreatmentOutcome } from "@/core/domain/entities/Treatment";

/**
 * Format date for HTML date input (YYYY-MM-DD)
 */
function formatDateForInput(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  try {
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    // If it's a datetime string, extract the date part
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
  } catch {
    // If parsing fails, return today's date
  }
  return new Date().toISOString().split("T")[0];
}

/**
 * Format time for HTML time input (HH:MM)
 */
function formatTimeForInput(timeStr?: string): string {
  if (!timeStr) return "";
  try {
    // If it's already in HH:MM format, return as is
    if (/^\d{2}:\d{2}$/.test(timeStr)) {
      return timeStr;
    }
    // If it's in HH:MM:SS format, extract HH:MM
    if (/^\d{2}:\d{2}:\d{2}/.test(timeStr)) {
      return timeStr.slice(0, 5);
    }
  } catch {
    // If parsing fails, return empty string
  }
  return "";
}

interface TreatmentFormProps {
  initialData?: TreatmentDetailDTO;
  doctors: Staff[];
  nurses: Staff[];
  onSubmit: (data: TreatmentFormDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function TreatmentForm({
  initialData,
  doctors,
  nurses,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}: TreatmentFormProps) {
  const [formData, setFormData] = useState<TreatmentFormDTO>({
    treatment_type: initialData?.treatment_type || "medication",
    treatment_name: initialData?.treatment_name || "",
    description: initialData?.description || "",
    notes: initialData?.notes || "",
    medications: initialData?.medications || "",
    dosage: initialData?.dosage || "",
    treatment_date: formatDateForInput(initialData?.treatment_date),
    treatment_time: formatTimeForInput(initialData?.treatment_time),
    results: initialData?.results || "",
    findings: initialData?.findings || "",
    outcome: initialData?.outcome || "pending",
    pre_procedure_notes: initialData?.pre_procedure_notes || "",
    post_procedure_notes: initialData?.post_procedure_notes || "",
    complications: initialData?.complications || "",
    doctor_id: initialData?.doctor?.id,
    nurse_id: initialData?.nurse?.id,
  });

  const [activeSection, setActiveSection] = useState<string>("basic");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        treatment_type: initialData.treatment_type || "medication",
        treatment_name: initialData.treatment_name || "",
        description: initialData.description || "",
        notes: initialData.notes || "",
        medications: initialData.medications || "",
        dosage: initialData.dosage || "",
        treatment_date: formatDateForInput(initialData.treatment_date),
        treatment_time: formatTimeForInput(initialData.treatment_time),
        results: initialData.results || "",
        findings: initialData.findings || "",
        outcome: initialData.outcome || "pending",
        pre_procedure_notes: initialData.pre_procedure_notes || "",
        post_procedure_notes: initialData.post_procedure_notes || "",
        complications: initialData.complications || "",
        doctor_id: initialData.doctor?.id,
        nurse_id: initialData.nurse?.id,
      });
    }
  }, [initialData]);

  const handleChange = (
    field: keyof TreatmentFormDTO,
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
    if (!formData.treatment_type) {
      setValidationError("Treatment type is required.");
      return;
    }
    if (!formData.treatment_name?.trim()) {
      setValidationError("Treatment name is required.");
      return;
    }

    await onSubmit(formData);
  };

  const sections = [
    { id: "basic", label: "Basic Info" },
    { id: "medication", label: "Medication" },
    { id: "results", label: "Results" },
    { id: "procedure", label: "Procedure Notes" },
    { id: "staff", label: "Staff" },
  ];

  // Check if treatment type requires procedure notes
  const isProcedureType = ["surgery", "procedure", "intervention_therapy"].includes(
    formData.treatment_type
  );

  // Check if treatment type requires medication fields
  const isMedicationType = [
    "medication",
    "chemotherapy",
    "hormone_therapy",
    "immunotherapy",
    "targeted_therapy",
  ].includes(formData.treatment_type);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h3 className="font-semibold text-lg">
            {isEdit ? "Edit Treatment Record" : "Add Treatment Record"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isEdit
              ? "Update treatment information"
              : "Create a new treatment record for this admission"}
          </p>
        </div>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            type="button"
            variant={activeSection === section.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </Button>
        ))}
      </div>

      {/* Basic Info Section */}
      {activeSection === "basic" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="treatment_name">
              Treatment Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="treatment_name"
              value={formData.treatment_name}
              onChange={(e) => handleChange("treatment_name", e.target.value)}
              placeholder="e.g., Complete Blood Count, Appendectomy"
              required
            />
          </div>

          <div>
            <Label htmlFor="treatment_type">
              Treatment Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.treatment_type}
              onValueChange={(value) => handleChange("treatment_type", value as TreatmentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {TREATMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="outcome">Outcome</Label>
            <Select
              value={formData.outcome || ""}
              onValueChange={(value) => handleChange("outcome", value as TreatmentOutcome)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                {TREATMENT_OUTCOMES.map((outcome) => (
                  <SelectItem key={outcome.value} value={outcome.value}>
                    {outcome.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="treatment_date">Treatment Date</Label>
            <Input
              id="treatment_date"
              type="date"
              value={formData.treatment_date || ""}
              onChange={(e) => handleChange("treatment_date", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="treatment_time">Treatment Time</Label>
            <Input
              id="treatment_time"
              type="time"
              value={formData.treatment_time || ""}
              onChange={(e) => handleChange("treatment_time", e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Detailed description of the treatment..."
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>
        </div>
      )}

      {/* Medication Section */}
      {activeSection === "medication" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!isMedicationType && (
            <div className="md:col-span-2 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Medication fields are primarily for medication-type treatments, but you can still
                record any medications administered during this treatment.
              </p>
            </div>
          )}

          <div className="md:col-span-2">
            <Label htmlFor="medications">Medications</Label>
            <Textarea
              id="medications"
              value={formData.medications || ""}
              onChange={(e) => handleChange("medications", e.target.value)}
              placeholder="e.g., Amoxicillin 500mg, Paracetamol 500mg"
              rows={2}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="dosage">Dosage Information</Label>
            <Textarea
              id="dosage"
              value={formData.dosage || ""}
              onChange={(e) => handleChange("dosage", e.target.value)}
              placeholder="e.g., Amoxicillin: 3 times daily for 7 days"
              rows={2}
            />
          </div>
        </div>
      )}

      {/* Results Section */}
      {activeSection === "results" && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="results">Results</Label>
            <Textarea
              id="results"
              value={formData.results || ""}
              onChange={(e) => handleChange("results", e.target.value)}
              placeholder="Treatment results..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="findings">Findings</Label>
            <Textarea
              id="findings"
              value={formData.findings || ""}
              onChange={(e) => handleChange("findings", e.target.value)}
              placeholder="Medical findings..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="complications">Complications (if any)</Label>
            <Textarea
              id="complications"
              value={formData.complications || ""}
              onChange={(e) => handleChange("complications", e.target.value)}
              placeholder="Any complications that occurred..."
              rows={2}
            />
          </div>
        </div>
      )}

      {/* Procedure Notes Section */}
      {activeSection === "procedure" && (
        <div className="grid grid-cols-1 gap-4">
          {!isProcedureType && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Procedure notes are primarily for surgical/procedural treatments, but you can still
                record any relevant pre/post notes.
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="pre_procedure_notes">Pre-Procedure Notes</Label>
            <Textarea
              id="pre_procedure_notes"
              value={formData.pre_procedure_notes || ""}
              onChange={(e) => handleChange("pre_procedure_notes", e.target.value)}
              placeholder="Notes before the procedure (preparation, consent, vitals, etc.)"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="post_procedure_notes">Post-Procedure Notes</Label>
            <Textarea
              id="post_procedure_notes"
              value={formData.post_procedure_notes || ""}
              onChange={(e) => handleChange("post_procedure_notes", e.target.value)}
              placeholder="Notes after the procedure (recovery, observations, instructions, etc.)"
              rows={4}
            />
          </div>
        </div>
      )}

      {/* Staff Section */}
      {activeSection === "staff" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="doctor_id">Assigned Doctor</Label>
            <Select
              value={formData.doctor_id?.toString() || ""}
              onValueChange={(value) =>
                handleChange("doctor_id", value ? parseInt(value, 10) : undefined)
              }
            >
              <SelectTrigger>
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
                handleChange("nurse_id", value ? parseInt(value, 10) : undefined)
              }
            >
              <SelectTrigger>
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
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update Treatment" : "Create Treatment"}
        </Button>
      </div>
    </form>
  );
}

