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
import { Loader2, AlertCircle } from "lucide-react";
import { useAddress } from "@/core/presentation/hooks/useAddress";
import type { AddressComponents } from "@/core/domain/entities/Address";

interface AddressSelectorProps {
  value: AddressComponents | null;
  onChange: (address: AddressComponents | null) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * AddressSelector Component
 * Cascading dropdown for selecting Myanmar addresses (Region → District → Township)
 */
export function AddressSelector({
  value,
  onChange,
  label = "Address",
  required = false,
  disabled = false,
}: AddressSelectorProps) {
  const {
    regions,
    isLoading,
    error,
    getDistrictsForRegion,
    getTownshipsForDistrict,
  } = useAddress();

  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedTownship, setSelectedTownship] = useState<string>("");

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      setSelectedRegion(value.region);
      setSelectedDistrict(value.district);
      setSelectedTownship(value.township);
    } else {
      setSelectedRegion("");
      setSelectedDistrict("");
      setSelectedTownship("");
    }
  }, [value]);

  // Get available districts and townships
  const availableDistricts = selectedRegion
    ? getDistrictsForRegion(selectedRegion)
    : [];
  const availableTownships =
    selectedRegion && selectedDistrict
      ? getTownshipsForDistrict(selectedRegion, selectedDistrict)
      : [];

  /**
   * Handle region change
   */
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedDistrict("");
    setSelectedTownship("");
    onChange(null); // Clear selection when region changes
  };

  /**
   * Handle district change
   */
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedTownship("");
    onChange(null); // Clear selection when district changes
  };

  /**
   * Handle township change
   */
  const handleTownshipChange = (township: string) => {
    setSelectedTownship(township);
    if (selectedRegion && selectedDistrict && township) {
      onChange({
        region: selectedRegion,
        district: selectedDistrict,
        township,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">
            Loading addresses...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-2 p-3 rounded-lg border bg-destructive/10 text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="region">
          {label} - Region {required && "*"}
        </Label>
        <Select
          value={selectedRegion}
          onValueChange={handleRegionChange}
          disabled={disabled}
        >
          <SelectTrigger className="mt-1.5" id="region">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedRegion && (
        <div>
          <Label htmlFor="district">District {required && "*"}</Label>
          <Select
            value={selectedDistrict}
            onValueChange={handleDistrictChange}
            disabled={disabled || !selectedRegion}
          >
            <SelectTrigger className="mt-1.5" id="district">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {availableDistricts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedRegion && selectedDistrict && (
        <div>
          <Label htmlFor="township">Township {required && "*"}</Label>
          <Select
            value={selectedTownship}
            onValueChange={handleTownshipChange}
            disabled={disabled || !selectedDistrict}
          >
            <SelectTrigger className="mt-1.5" id="township">
              <SelectValue placeholder="Select township" />
            </SelectTrigger>
            <SelectContent>
              {availableTownships.map((township) => (
                <SelectItem key={township} value={township}>
                  {township}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
