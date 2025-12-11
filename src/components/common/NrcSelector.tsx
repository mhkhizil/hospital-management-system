"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";
import { useNrc } from "@/core/presentation/hooks/useNrc";
import type { NrcComponents, NrcNumber } from "@/core/domain/entities/Nrc";

interface NrcSelectorProps {
  value: NrcNumber;
  onChange: (nrcNumber: NrcNumber) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * NrcSelector Component
 * Multi-part selector for NRC numbers: Code → Township → Citizenship → Number
 * Format: {code}/{name_en}({citizenship})123456
 */
export function NrcSelector({
  value,
  onChange,
  label = "NRC Number",
  required = false,
  disabled = false,
}: NrcSelectorProps) {
  const {
    codes,
    citizenshipOptions,
    isLoading,
    error,
    parseNrcNumber,
    buildNrcNumber,
  } = useNrc();

  const [components, setComponents] = useState<NrcComponents>({
    code: "",
    nameEn: "",
    citizenship: "N",
    number: "",
  });

  // Parse value on mount and when value changes
  useEffect(() => {
    if (value) {
      const parsed = parseNrcNumber(value);
      if (parsed) {
        setComponents(parsed);
      }
    } else {
      // Reset to empty state
      setComponents({
        code: "",
        nameEn: "",
        citizenship: "N",
        number: "",
      });
    }
  }, [value, parseNrcNumber]);

  /**
   * Handle NRC code change
   */
  const handleCodeChange = (code: string) => {
    const newComponents: NrcComponents = {
      ...components,
      code,
      nameEn: "", // Clear township when code changes
    };
    setComponents(newComponents);
    updateNrcNumber(newComponents);
  };

  /**
   * Handle township change
   */
  const handleTownshipChange = (nameEn: string) => {
    const newComponents: NrcComponents = {
      ...components,
      nameEn,
    };
    setComponents(newComponents);
    updateNrcNumber(newComponents);
  };

  /**
   * Handle citizenship change
   */
  const handleCitizenshipChange = (citizenship: string) => {
    const newComponents: NrcComponents = {
      ...components,
      citizenship: citizenship as any,
    };
    setComponents(newComponents);
    updateNrcNumber(newComponents);
  };

  /**
   * Handle number change
   */
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value.replace(/\D/g, "").slice(0, 6); // Only digits, max 6
    const newComponents: NrcComponents = {
      ...components,
      number,
    };
    setComponents(newComponents);
    updateNrcNumber(newComponents);
  };

  /**
   * Update the full NRC number when components change
   */
  const updateNrcNumber = (newComponents: NrcComponents) => {
    // Only build if all required parts are present
    if (
      newComponents.code &&
      newComponents.nameEn &&
      newComponents.citizenship &&
      newComponents.number.length === 6
    ) {
      const nrcNumber = buildNrcNumber(newComponents);
      onChange(nrcNumber);
    } else {
      // Clear the value if incomplete
      onChange("");
    }
  };

  /**
   * Get unique NRC codes for the first dropdown
   */
  const uniqueCodes = Array.from(
    new Set(codes.map((code) => code.nrc_code))
  ).sort((a, b) => parseInt(a) - parseInt(b));

  /**
   * Get townships for the selected code
   */
  const townshipsForCode = components.code
    ? codes
        .filter((code) => code.nrc_code === components.code)
        .map((code) => ({
          value: code.name_en,
          label: `${code.name_en} (${code.name_mm})`,
        }))
    : [];

  /**
   * Check if the NRC is complete and valid
   */
  const isComplete =
    components.code &&
    components.nameEn &&
    components.citizenship &&
    components.number.length === 6;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>
          {label}
          {required && " *"}
        </Label>
        <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">
            Loading NRC codes...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>
          {label}
          {required && " *"}
        </Label>
        <div className="flex items-center gap-2 p-3 rounded-lg border bg-destructive/10 text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label>
        {label}
        {required && " *"}
      </Label>

      {/* NRC Cascading Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* NRC Code Selector */}
        <div>
          <Label htmlFor="nrc-code" className="text-sm font-normal">
            Code *
          </Label>
          <Select
            value={components.code}
            onValueChange={handleCodeChange}
            disabled={disabled}
          >
            <SelectTrigger id="nrc-code" className="mt-1">
              <SelectValue placeholder="Select code" />
            </SelectTrigger>
            <SelectContent>
              {uniqueCodes.map((code) => (
                <SelectItem key={code} value={code}>
                  {code}/
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Township Selector */}
        <div>
          <Label htmlFor="nrc-township" className="text-sm font-normal">
            Township *
          </Label>
          <Select
            value={components.nameEn}
            onValueChange={handleTownshipChange}
            disabled={disabled || !components.code}
          >
            <SelectTrigger id="nrc-township" className="mt-1">
              <SelectValue
                placeholder={
                  components.code ? "Select township" : "Select code first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {townshipsForCode.map((township) => (
                <SelectItem key={township.value} value={township.value}>
                  {township.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Citizenship Selector */}
        <div>
          <Label htmlFor="nrc-citizenship" className="text-sm font-normal">
            Citizenship *
          </Label>
          <Select
            value={components.citizenship}
            onValueChange={handleCitizenshipChange}
            disabled={disabled}
          >
            <SelectTrigger id="nrc-citizenship" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {citizenshipOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Number Input */}
        <div>
          <Label htmlFor="nrc-number" className="text-sm font-normal">
            Number (6 digits) *
          </Label>
          <Input
            id="nrc-number"
            type="text"
            value={components.number}
            onChange={handleNumberChange}
            placeholder="123456"
            maxLength={6}
            disabled={disabled}
            className="mt-1"
          />
        </div>
      </div>

      {/* NRC Preview */}
      {isComplete && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-emerald-500 bg-emerald-500/10 text-emerald-400 text-sm">
          <div className="p-1 rounded-full bg-emerald-500/20">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span>
            Complete NRC:{" "}
            <strong>
              {components.code}/{components.nameEn}({components.citizenship})
              {components.number}
            </strong>
          </span>
        </div>
      )}

      {/* Selection Progress */}
      {components.code && (
        <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded border">
          Progress:{" "}
          <strong className="text-foreground">{components.code}/</strong>
          {components.nameEn && (
            <span className="ml-2">
              • Township:{" "}
              <strong className="text-foreground">{components.nameEn}</strong>
            </span>
          )}
          {components.nameEn && (
            <span className="ml-2">
              • Citizenship:{" "}
              <strong className="text-foreground">
                {components.citizenship}
              </strong>
            </span>
          )}
          {components.number && (
            <span className="ml-2">
              • Number:{" "}
              <strong className="text-foreground">{components.number}</strong>
            </span>
          )}
        </div>
      )}

      {/* Completion Indicator */}
      {!isComplete && components.code && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-sm">
          <div className="p-1 rounded-full bg-amber-500/20">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span>Please complete all fields to generate the NRC number.</span>
        </div>
      )}
    </div>
  );
}
