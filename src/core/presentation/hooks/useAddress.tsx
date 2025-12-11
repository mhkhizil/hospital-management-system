"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { container, TOKENS } from "@/core/infrastructure/di/container";
import { AddressManagementService } from "@/core/application/services/AddressManagementService";
import { ApiError } from "@/core/infrastructure/api/HttpClient";
import type {
  MyanmarAddressData,
  AddressComponents,
  AddressJSON,
} from "@/core/domain/entities/Address";

/**
 * State interface for address management
 */
interface AddressManagementState {
  myanmarAddresses: MyanmarAddressData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for address management
 * Provides Myanmar address data and utility functions
 */
export function useAddress() {
  // Get service from container
  const addressService = useMemo(
    () => container.resolve<AddressManagementService>(TOKENS.ADDRESS_SERVICE),
    []
  );

  const [state, setState] = useState<AddressManagementState>({
    myanmarAddresses: null,
    isLoading: false,
    error: null,
  });

  /**
   * Fetch Myanmar addresses
   */
  const fetchMyanmarAddresses = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const addresses = await addressService.getMyanmarAddresses();
      setState({
        myanmarAddresses: addresses,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Failed to load Myanmar addresses";
      setState({
        myanmarAddresses: null,
        isLoading: false,
        error: errorMessage,
      });
    }
  }, [addressService]);

  /**
   * Parse address JSON to components
   */
  const parseAddressJSON = useCallback(
    (addressJSON: AddressJSON | null | undefined): AddressComponents | null => {
      return addressService.parseAddressJSON(addressJSON);
    },
    [addressService]
  );

  /**
   * Convert address components to JSON
   */
  const toAddressJSON = useCallback(
    (components: AddressComponents | null): AddressJSON | null => {
      return addressService.toAddressJSON(components);
    },
    [addressService]
  );

  /**
   * Format address for display
   */
  const formatAddressForDisplay = useCallback(
    (addressJSON: AddressJSON | null | undefined): string => {
      return addressService.formatAddressForDisplay(addressJSON);
    },
    [addressService]
  );

  /**
   * Get districts for a region
   */
  const getDistrictsForRegion = useCallback(
    (region: string): string[] => {
      if (!state.myanmarAddresses || !region) return [];
      return Object.keys(state.myanmarAddresses[region] || {});
    },
    [state.myanmarAddresses]
  );

  /**
   * Get townships for a region and district
   */
  const getTownshipsForDistrict = useCallback(
    (region: string, district: string): string[] => {
      if (!state.myanmarAddresses || !region || !district) return [];
      return state.myanmarAddresses[region]?.[district] || [];
    },
    [state.myanmarAddresses]
  );

  /**
   * Get all regions
   */
  const regions = useMemo(() => {
    if (!state.myanmarAddresses) return [];
    return Object.keys(state.myanmarAddresses);
  }, [state.myanmarAddresses]);

  // Auto-fetch addresses on mount
  useEffect(() => {
    fetchMyanmarAddresses();
  }, [fetchMyanmarAddresses]);

  return {
    // State
    myanmarAddresses: state.myanmarAddresses,
    regions,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    fetchMyanmarAddresses,
    parseAddressJSON,
    toAddressJSON,
    formatAddressForDisplay,
    getDistrictsForRegion,
    getTownshipsForDistrict,
  };
}
