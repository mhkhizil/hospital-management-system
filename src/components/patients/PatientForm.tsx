"use client";

import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import type {
  PatientFormDTO,
  PatientDetailDTO,
} from "@/core/application/dtos/PatientDTO";
import type {
  PatientSex,
  BloodType,
  MaritalStatus,
} from "@/core/domain/entities/Patient";

interface PatientFormProps {
  initialData?: PatientDetailDTO;
  onSubmit: (data: PatientFormDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const SEX_OPTIONS: { value: PatientSex; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const BLOOD_TYPE_OPTIONS: { value: BloodType; label: string }[] = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const MARITAL_STATUS_OPTIONS: { value: MaritalStatus; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "other", label: "Other" },
];

export function PatientForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: PatientFormProps) {
  // Helper function to convert ISO date string to YYYY-MM-DD format for date input
  const formatDateForInput = (
    dateStr: string | null | undefined
  ): string | undefined => {
    if (!dateStr) return undefined;
    try {
      // Extract just the date part (YYYY-MM-DD) from ISO string
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return undefined;
      return date.toISOString().split("T")[0];
    } catch {
      return undefined;
    }
  };

  // Initialize form data from initialData
  const initializeFormData = (data?: PatientDetailDTO): PatientFormDTO => ({
    name: data?.name || "",
    nrc_number: data?.nrc_number || undefined,
    sex: data?.sex || undefined,
    age: data?.age || undefined,
    dob: formatDateForInput(data?.dob),
    contact_phone: data?.contact_phone || undefined,
    permanent_address: data?.permanent_address || undefined,
    marital_status: data?.marital_status || undefined,
    ethnic_group: data?.ethnic_group || undefined,
    religion: data?.religion || undefined,
    occupation: data?.occupation || undefined,
    father_name: data?.father_name || undefined,
    mother_name: data?.mother_name || undefined,
    nearest_relative_name: data?.nearest_relative_name || undefined,
    nearest_relative_phone: data?.nearest_relative_phone || undefined,
    relationship: data?.relationship || undefined,
    blood_type: data?.blood_type || undefined,
    known_allergies: data?.known_allergies || undefined,
    chronic_conditions: data?.chronic_conditions || undefined,
  });

  const [formData, setFormData] = useState<PatientFormDTO>(() =>
    initializeFormData(initialData)
  );
  const [activeSection, setActiveSection] = useState<string>("basic");

  // Update form data when initialData changes (e.g., when switching to edit mode)
  useEffect(() => {
    setFormData(initializeFormData(initialData));
  }, [initialData]);

  const handleChange = (
    field: keyof PatientFormDTO,
    value: string | number | undefined
  ) => {
    setFormData((prev) => {
      const isNameField = field === "name";
      const nextValue = value === "" ? (isNameField ? "" : undefined) : value;

      return {
        ...prev,
        [field]: nextValue,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Note: If update fails, error is handled by parent component
    // We keep user's form data so they can fix any issues and retry
  };

  const sections = [
    { id: "basic", label: "Basic Info" },
    { id: "personal", label: "Personal" },
    { id: "contact", label: "Contact" },
    { id: "medical", label: "Medical" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <div className="md:col-span-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter patient's full name"
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="nrc_number">NRC Number</Label>
            <Input
              id="nrc_number"
              value={formData.nrc_number || ""}
              onChange={(e) => handleChange("nrc_number", e.target.value)}
              placeholder="e.g., 12/ABC(N)123456"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="contact_phone">Contact Phone</Label>
            <Input
              id="contact_phone"
              value={formData.contact_phone || ""}
              onChange={(e) => handleChange("contact_phone", e.target.value)}
              placeholder="e.g., 09123456789"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="sex">Sex</Label>
            <Select
              value={formData.sex}
              onValueChange={(value) =>
                handleChange("sex", value as PatientSex)
              }
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                {SEX_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min={0}
              max={150}
              value={formData.age || ""}
              onChange={(e) =>
                handleChange(
                  "age",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="Enter age"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob || ""}
              onChange={(e) => handleChange("dob", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="blood_type">Blood Type</Label>
            <Select
              value={formData.blood_type}
              onValueChange={(value) =>
                handleChange("blood_type", value as BloodType)
              }
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Personal Details */}
      {activeSection === "personal" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="marital_status">Marital Status</Label>
            <Select
              value={formData.marital_status}
              onValueChange={(value) =>
                handleChange("marital_status", value as MaritalStatus)
              }
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {MARITAL_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={formData.occupation || ""}
              onChange={(e) => handleChange("occupation", e.target.value)}
              placeholder="Enter occupation"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="ethnic_group">Ethnic Group</Label>
            <Input
              id="ethnic_group"
              value={formData.ethnic_group || ""}
              onChange={(e) => handleChange("ethnic_group", e.target.value)}
              placeholder="e.g., Bamar, Shan"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="religion">Religion</Label>
            <Input
              id="religion"
              value={formData.religion || ""}
              onChange={(e) => handleChange("religion", e.target.value)}
              placeholder="e.g., Buddhist, Christian"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="father_name">Father's Name</Label>
            <Input
              id="father_name"
              value={formData.father_name || ""}
              onChange={(e) => handleChange("father_name", e.target.value)}
              placeholder="Enter father's name"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="mother_name">Mother's Name</Label>
            <Input
              id="mother_name"
              value={formData.mother_name || ""}
              onChange={(e) => handleChange("mother_name", e.target.value)}
              placeholder="Enter mother's name"
              className="mt-1.5"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="permanent_address">Permanent Address</Label>
            <Input
              id="permanent_address"
              value={formData.permanent_address || ""}
              onChange={(e) =>
                handleChange("permanent_address", e.target.value)
              }
              placeholder="Enter full address"
              className="mt-1.5"
            />
          </div>
        </div>
      )}

      {/* Emergency Contact */}
      {activeSection === "contact" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">
              Emergency Contact Information
            </h3>
          </div>

          <div>
            <Label htmlFor="nearest_relative_name">Contact Person Name</Label>
            <Input
              id="nearest_relative_name"
              value={formData.nearest_relative_name || ""}
              onChange={(e) =>
                handleChange("nearest_relative_name", e.target.value)
              }
              placeholder="Emergency contact name"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="nearest_relative_phone">Contact Person Phone</Label>
            <Input
              id="nearest_relative_phone"
              value={formData.nearest_relative_phone || ""}
              onChange={(e) =>
                handleChange("nearest_relative_phone", e.target.value)
              }
              placeholder="Emergency contact phone"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="relationship">Relationship</Label>
            <Input
              id="relationship"
              value={formData.relationship || ""}
              onChange={(e) => handleChange("relationship", e.target.value)}
              placeholder="e.g., spouse, parent, sibling"
              className="mt-1.5"
            />
          </div>
        </div>
      )}

      {/* Medical Information */}
      {activeSection === "medical" && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="known_allergies">Known Allergies</Label>
            <Input
              id="known_allergies"
              value={formData.known_allergies || ""}
              onChange={(e) => handleChange("known_allergies", e.target.value)}
              placeholder="e.g., Penicillin, Aspirin (comma-separated)"
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              List any known drug or food allergies
            </p>
          </div>

          <div>
            <Label htmlFor="chronic_conditions">Chronic Conditions</Label>
            <Input
              id="chronic_conditions"
              value={formData.chronic_conditions || ""}
              onChange={(e) =>
                handleChange("chronic_conditions", e.target.value)
              }
              placeholder="e.g., Hypertension, Diabetes (comma-separated)"
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              List any chronic medical conditions
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
        <Button
          type="submit"
          disabled={isLoading || !(formData.name || "").trim()}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Patient" : "Register Patient"}
        </Button>
      </div>
    </form>
  );
}
