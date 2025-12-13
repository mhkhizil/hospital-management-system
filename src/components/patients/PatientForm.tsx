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
import { Loader2, AlertCircle } from "lucide-react";
import { AddressSelector } from "@/components/common/AddressSelector";
import { NrcSelector } from "@/components/common/NrcSelector";
import { useAddress } from "@/core/presentation/hooks/useAddress";
import type {
  PatientFormDTO,
  PatientDetailDTO,
} from "@/core/application/dtos/PatientDTO";
import type {
  PatientSex,
  BloodType,
  MaritalStatus,
} from "@/core/domain/entities/Patient";
import type { AddressComponents } from "@/core/domain/entities/Address";

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

const ETHNIC_GROUP_OPTIONS: { value: string; label: string }[] = [
  { value: "bamar", label: "Bamar" },
  { value: "kachin", label: "Kachin" },
  { value: "kayah", label: "Kayah" },
  { value: "kayin", label: "Kayin" },
  { value: "chin", label: "Chin" },
  { value: "mon", label: "Mon" },
  { value: "rakhine", label: "Rakhine" },
  { value: "shan", label: "Shan" },
  { value: "palaung", label: "Palaung" },
  { value: "wa", label: "Wa" },
  { value: "kokang", label: "Kokang" },
  { value: "karenni", label: "Karenni" },
  { value: "other", label: "Other" },
];

const RELIGION_OPTIONS: { value: string; label: string }[] = [
  { value: "islam", label: "Islam" },
  { value: "buddhist", label: "Buddhist" },
  { value: "christian", label: "Christian" },
  { value: "hindu", label: "Hindu" },
  { value: "animist", label: "Animist" },
  { value: "other", label: "Other" },
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

export function PatientForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: PatientFormProps) {
  const { parseAddressJSON, toAddressJSON } = useAddress();

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
    nrc_number: data?.nrc_number || "",
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PatientFormDTO, string>>
  >({});

  // Validation helper functions
  const validateNameField = (value: string): string | null => {
    if (!value.trim()) return null; // Empty is handled by required validation
    // Allow: letters (Unicode), spaces, hyphens, apostrophes, periods
    const namePattern = /^[\p{L}\s\-'.]+$/u;
    if (!namePattern.test(value)) {
      return "Only letters, spaces, hyphens (-), apostrophes ('), and periods (.) are allowed";
    }
    return null;
  };

  const validatePhoneField = (value: string): string | null => {
    if (!value.trim()) return null; // Empty is handled by required validation
    // Allow: digits, spaces, plus signs, hyphens, parentheses
    const phonePattern = /^[\d\s+\-()]+$/;
    if (!phonePattern.test(value)) {
      return "Only digits, spaces, plus signs (+), hyphens (-), and parentheses () are allowed";
    }
    return null;
  };

  const validateAge = (value: number | undefined): string | null => {
    if (value === undefined || value === null) return null; // Empty is handled by required validation
    if (!Number.isInteger(value)) {
      return "Age must be a whole number";
    }
    if (value < 0) {
      return "Age cannot be negative";
    }
    if (value > 150) {
      return "Age cannot be greater than 150";
    }
    return null;
  };

  // Custom ethnic group and religion inputs when "Other" is selected
  const [customEthnicGroup, setCustomEthnicGroup] = useState<string>("");
  const [customReligion, setCustomReligion] = useState<string>("");
  const [isEthnicGroupOther, setIsEthnicGroupOther] = useState<boolean>(false);
  const [isReligionOther, setIsReligionOther] = useState<boolean>(false);

  // Address state
  const [addressComponents, setAddressComponents] =
    useState<AddressComponents | null>(() =>
      parseAddressJSON(initialData?.permanent_address)
    );

  // Update form data when initialData changes (e.g., when switching to edit mode)
  useEffect(() => {
    setFormData(initializeFormData(initialData));
    setAddressComponents(parseAddressJSON(initialData?.permanent_address));

    // Initialize custom ethnic group and religion values
    if (initialData?.ethnic_group) {
      const isInOptions = ETHNIC_GROUP_OPTIONS.some(
        (option) =>
          option.value.toLowerCase() === initialData.ethnic_group?.toLowerCase()
      );
      if (!isInOptions) {
        setCustomEthnicGroup(initialData.ethnic_group);
        setIsEthnicGroupOther(true);
      } else {
        setIsEthnicGroupOther(false);
      }
    } else {
      setIsEthnicGroupOther(false);
    }

    if (initialData?.religion) {
      const isInOptions = RELIGION_OPTIONS.some(
        (option) =>
          option.value.toLowerCase() === initialData.religion?.toLowerCase()
      );
      if (!isInOptions) {
        setCustomReligion(initialData.religion);
        setIsReligionOther(true);
      } else {
        setIsReligionOther(false);
      }
    } else {
      setIsReligionOther(false);
    }
  }, [initialData, parseAddressJSON]);

  const handleChange = (
    field: keyof PatientFormDTO,
    value: string | number | undefined
  ) => {
    setFormData((prev) => {
      const isNameField = field === "name";
      const nextValue = value === "" ? (isNameField ? "" : undefined) : value;

      // Validate field format in real-time
      let formatError: string | null = null;
      if (typeof nextValue === "string" && nextValue.trim()) {
        // Name fields validation
        if (
          [
            "name",
            "father_name",
            "mother_name",
            "nearest_relative_name",
            "occupation",
            "relationship",
          ].includes(field)
        ) {
          formatError = validateNameField(nextValue);
        }
        // Phone fields validation
        if (["contact_phone", "nearest_relative_phone"].includes(field)) {
          formatError = validatePhoneField(nextValue);
        }
      } else if (typeof nextValue === "number" && field === "age") {
        formatError = validateAge(nextValue);
      }

      // Update field errors
      setFieldErrors((prev) => ({
        ...prev,
        [field]: formatError || undefined,
      }));

      return {
        ...prev,
        [field]: nextValue,
      };
    });
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
      permanent_address: addressJSON || undefined,
    }));
  };

  const handleEthnicGroupChange = (value: string) => {
    if (value === "other") {
      setIsEthnicGroupOther(true);
      // When "Other" is selected, use the custom value if it exists
      const finalValue = customEthnicGroup || "Other";
      handleChange("ethnic_group", finalValue);
    } else {
      setIsEthnicGroupOther(false);
      // Clear custom value when a predefined option is selected
      setCustomEthnicGroup("");
      handleChange("ethnic_group", value);
    }
  };

  const handleReligionChange = (value: string) => {
    if (value === "other") {
      setIsReligionOther(true);
      // When "Other" is selected, use the custom value if it exists
      const finalValue = customReligion || "Other";
      handleChange("religion", finalValue);
    } else {
      setIsReligionOther(false);
      // Clear custom value when a predefined option is selected
      setCustomReligion("");
      handleChange("religion", value);
    }
  };

  const handleCustomEthnicGroupChange = (value: string) => {
    setCustomEthnicGroup(value);
    handleChange("ethnic_group", value || "Other");
  };

  const handleCustomReligionChange = (value: string) => {
    setCustomReligion(value);
    handleChange("religion", value || "Other");
  };

  // Validation helper
  const validateRequiredFields = (): string[] => {
    const errors: string[] = [];

    // Required field validation
    if (!formData.name?.trim()) errors.push("Full Name is required");
    if (!formData.nrc_number?.trim()) errors.push("NRC Number is required");
    if (!formData.sex) errors.push("Sex is required");
    if (formData.age === undefined || formData.age === null)
      errors.push("Age is required");
    if (!formData.dob) errors.push("Date of Birth is required");
    if (!formData.contact_phone?.trim())
      errors.push("Contact Phone is required");
    if (!formData.permanent_address)
      errors.push("Permanent Address is required");
    if (!formData.marital_status) errors.push("Marital Status is required");
    if (!formData.occupation?.trim()) errors.push("Occupation is required");
    if (!formData.father_name?.trim()) errors.push("Father's Name is required");
    if (!formData.mother_name?.trim()) errors.push("Mother's Name is required");
    if (!formData.nearest_relative_name?.trim())
      errors.push("Emergency Contact Name is required");
    if (!formData.nearest_relative_phone?.trim())
      errors.push("Emergency Contact Phone is required");
    if (!formData.relationship?.trim()) errors.push("Relationship is required");
    if (!formData.blood_type) errors.push("Blood Type is required");

    // Format validation
    if (formData.name?.trim()) {
      const nameError = validateNameField(formData.name);
      if (nameError) errors.push(`Full Name: ${nameError}`);
    }
    if (formData.father_name?.trim()) {
      const nameError = validateNameField(formData.father_name);
      if (nameError) errors.push(`Father's Name: ${nameError}`);
    }
    if (formData.mother_name?.trim()) {
      const nameError = validateNameField(formData.mother_name);
      if (nameError) errors.push(`Mother's Name: ${nameError}`);
    }
    if (formData.nearest_relative_name?.trim()) {
      const nameError = validateNameField(formData.nearest_relative_name);
      if (nameError) errors.push(`Emergency Contact Name: ${nameError}`);
    }
    if (formData.occupation?.trim()) {
      const nameError = validateNameField(formData.occupation);
      if (nameError) errors.push(`Occupation: ${nameError}`);
    }
    if (formData.relationship?.trim()) {
      const nameError = validateNameField(formData.relationship);
      if (nameError) errors.push(`Relationship: ${nameError}`);
    }
    if (formData.contact_phone?.trim()) {
      const phoneError = validatePhoneField(formData.contact_phone);
      if (phoneError) errors.push(`Contact Phone: ${phoneError}`);
    }
    if (formData.nearest_relative_phone?.trim()) {
      const phoneError = validatePhoneField(formData.nearest_relative_phone);
      if (phoneError) errors.push(`Emergency Contact Phone: ${phoneError}`);
    }
    if (formData.age !== undefined && formData.age !== null) {
      const ageError = validateAge(formData.age);
      if (ageError) errors.push(`Age: ${ageError}`);
    }

    return errors;
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
    // Note: If update fails, error is handled by parent component
    // We keep user's form data so they can fix any issues and retry
  };

  // Helper to check if all required fields are filled and valid
  const isFormValid = (): boolean => {
    const hasRequiredFields =
      !!(formData.name || "").trim() &&
      !!(formData.nrc_number || "").trim() &&
      !!formData.sex &&
      formData.age !== undefined &&
      formData.age !== null &&
      !!formData.dob &&
      !!(formData.contact_phone || "").trim() &&
      !!formData.permanent_address &&
      !!formData.marital_status &&
      !!(formData.occupation || "").trim() &&
      !!(formData.father_name || "").trim() &&
      !!(formData.mother_name || "").trim() &&
      !!(formData.nearest_relative_name || "").trim() &&
      !!(formData.nearest_relative_phone || "").trim() &&
      !!(formData.relationship || "").trim() &&
      !!formData.blood_type;

    // Check if there are any format errors
    const hasFormatErrors = Object.keys(fieldErrors).length > 0;

    return hasRequiredFields && !hasFormatErrors;
  };

  const sections = [
    { id: "basic", label: "Basic Info" },
    { id: "personal", label: "Personal" },
    { id: "contact", label: "Contact" },
    { id: "medical", label: "Medical" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              left blank.
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
          <div className="md:col-span-2">
            <FormLabel htmlFor="name" required>
              Full Name
            </FormLabel>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter patient's full name"
              required
              className={`mt-1.5 ${
                fieldErrors.name ? "border-destructive" : ""
              }`}
            />
            {fieldErrors.name && (
              <p className="text-xs text-destructive mt-1">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <NrcSelector
              value={formData.nrc_number || ""}
              onChange={(nrcNumber) => handleChange("nrc_number", nrcNumber)}
              label="NRC Number"
              required
            />
          </div>

          <div>
            <FormLabel htmlFor="contact_phone" required>
              Contact Phone
            </FormLabel>
            <Input
              id="contact_phone"
              value={formData.contact_phone || ""}
              onChange={(e) => handleChange("contact_phone", e.target.value)}
              placeholder="e.g., 09123456789"
              required
              className={`mt-1.5 ${
                fieldErrors.contact_phone ? "border-destructive" : ""
              }`}
            />
            {fieldErrors.contact_phone && (
              <p className="text-xs text-destructive mt-1">
                {fieldErrors.contact_phone}
              </p>
            )}
          </div>

          <div>
            <FormLabel htmlFor="sex" required>
              Sex
            </FormLabel>
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
            <FormLabel htmlFor="age" required>
              Age
            </FormLabel>
            <Input
              id="age"
              type="number"
              min={0}
              max={150}
              step={1}
              value={formData.age || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  handleChange("age", undefined);
                } else {
                  // Check if it's a valid integer (no decimals)
                  if (value.includes(".")) {
                    // Reject decimal input
                    return;
                  }
                  const numValue = parseInt(value);
                  if (!isNaN(numValue)) {
                    handleChange("age", numValue);
                  }
                }
              }}
              onBlur={(e) => {
                // Validate on blur to catch any edge cases
                const value = e.target.value;
                if (value && formData.age !== undefined) {
                  const error = validateAge(formData.age);
                  setFieldErrors((prev) => ({
                    ...prev,
                    age: error || undefined,
                  }));
                }
              }}
              placeholder="Enter age"
              required
              className={`mt-1.5 ${
                fieldErrors.age ? "border-destructive" : ""
              }`}
            />
            {fieldErrors.age && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.age}</p>
            )}
          </div>

          <div>
            <FormLabel htmlFor="dob" required>
              Date of Birth
            </FormLabel>
            <Input
              id="dob"
              type="date"
              value={formData.dob || ""}
              onChange={(e) => handleChange("dob", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <FormLabel htmlFor="blood_type" required>
              Blood Type
            </FormLabel>
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
            <FormLabel htmlFor="marital_status" required>
              Marital Status
            </FormLabel>
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
            <FormLabel htmlFor="occupation" required>
              Occupation
            </FormLabel>
            <Input
              id="occupation"
              value={formData.occupation || ""}
              onChange={(e) => handleChange("occupation", e.target.value)}
              placeholder="Enter occupation"
              required
              className={`mt-1.5 ${
                fieldErrors.occupation ? "border-destructive" : ""
              }`}
            />
            {fieldErrors.occupation && (
              <p className="text-xs text-destructive mt-1">
                {fieldErrors.occupation}
              </p>
            )}
          </div>

          <div>
            <FormLabel htmlFor="ethnic_group" optional>
              Ethnic Group
            </FormLabel>
            <Select
              value={
                formData.ethnic_group
                  ? ETHNIC_GROUP_OPTIONS.some(
                      (option) =>
                        option.value.toLowerCase() ===
                        formData.ethnic_group?.toLowerCase()
                    )
                    ? formData.ethnic_group.toLowerCase()
                    : "other"
                  : ""
              }
              onValueChange={handleEthnicGroupChange}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select ethnic group" />
              </SelectTrigger>
              <SelectContent>
                {ETHNIC_GROUP_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isEthnicGroupOther && (
              <Input
                id="custom_ethnic_group"
                value={customEthnicGroup}
                onChange={(e) => handleCustomEthnicGroupChange(e.target.value)}
                placeholder="Enter custom ethnic group"
                className="mt-2"
              />
            )}
          </div>

          <div>
            <FormLabel htmlFor="religion" optional>
              Religion
            </FormLabel>
            <Select
              value={
                formData.religion
                  ? RELIGION_OPTIONS.some(
                      (option) =>
                        option.value.toLowerCase() ===
                        formData.religion?.toLowerCase()
                    )
                    ? formData.religion.toLowerCase()
                    : "other"
                  : ""
              }
              onValueChange={handleReligionChange}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select religion" />
              </SelectTrigger>
              <SelectContent>
                {RELIGION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isReligionOther && (
              <Input
                id="custom_religion"
                value={customReligion}
                onChange={(e) => handleCustomReligionChange(e.target.value)}
                placeholder="Enter custom religion"
                className="mt-2"
              />
            )}
          </div>

          <div>
            <FormLabel htmlFor="father_name" required>
              Father's Name
            </FormLabel>
            <Input
              id="father_name"
              value={formData.father_name || ""}
              onChange={(e) => handleChange("father_name", e.target.value)}
              placeholder="Enter father's name"
              required
              className={`mt-1.5 ${
                fieldErrors.father_name ? "border-destructive" : ""
              }`}
            />
            {fieldErrors.father_name && (
              <p className="text-xs text-destructive mt-1">
                {fieldErrors.father_name}
              </p>
            )}
          </div>

          <div>
            <FormLabel htmlFor="mother_name" required>
              Mother's Name
            </FormLabel>
            <Input
              id="mother_name"
              value={formData.mother_name || ""}
              onChange={(e) => handleChange("mother_name", e.target.value)}
              placeholder="Enter mother's name"
              required
              className={`mt-1.5 ${
                fieldErrors.mother_name ? "border-destructive" : ""
              }`}
            />
            {fieldErrors.mother_name && (
              <p className="text-xs text-destructive mt-1">
                {fieldErrors.mother_name}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <AddressSelector
              value={addressComponents}
              onChange={handleAddressChange}
              label="Permanent Address"
              required
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
            <FormLabel htmlFor="nearest_relative_name" required>
              Contact Person Name
            </FormLabel>
            <Input
              id="nearest_relative_name"
              value={formData.nearest_relative_name || ""}
              onChange={(e) =>
                handleChange("nearest_relative_name", e.target.value)
              }
              placeholder="Emergency contact name"
              required
              className={`mt-1.5 ${
                fieldErrors.nearest_relative_name ? "border-destructive" : ""
              }`}
            />
            {fieldErrors.nearest_relative_name && (
              <p className="text-xs text-destructive mt-1">
                {fieldErrors.nearest_relative_name}
              </p>
            )}
          </div>

          <div>
            <FormLabel htmlFor="nearest_relative_phone" required>
              Contact Person Phone
            </FormLabel>
            <Input
              id="nearest_relative_phone"
              value={formData.nearest_relative_phone || ""}
              onChange={(e) =>
                handleChange("nearest_relative_phone", e.target.value)
              }
              placeholder="Emergency contact phone"
              required
              className={`mt-1.5 ${
                fieldErrors.nearest_relative_phone ? "border-destructive" : ""
              }`}
            />
            {fieldErrors.nearest_relative_phone && (
              <p className="text-xs text-destructive mt-1">
                {fieldErrors.nearest_relative_phone}
              </p>
            )}
          </div>

          <div>
            <FormLabel htmlFor="relationship" required>
              Relationship
            </FormLabel>
            <Input
              id="relationship"
              value={formData.relationship || ""}
              onChange={(e) => handleChange("relationship", e.target.value)}
              placeholder="e.g., spouse, parent, sibling"
              required
              className={`mt-1.5 ${
                fieldErrors.relationship ? "border-destructive" : ""
              }`}
            />
            {fieldErrors.relationship && (
              <p className="text-xs text-destructive mt-1">
                {fieldErrors.relationship}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Medical Information */}
      {activeSection === "medical" && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <FormLabel htmlFor="known_allergies" optional>
              Known Allergies
            </FormLabel>
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
            <FormLabel htmlFor="chronic_conditions" optional>
              Chronic Conditions
            </FormLabel>
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
        <Button type="submit" disabled={isLoading || !isFormValid()}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Patient" : "Register Patient"}
        </Button>
      </div>
    </form>
  );
}
