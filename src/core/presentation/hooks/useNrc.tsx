"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { container, TOKENS } from "@/core/infrastructure/di/container";
import { NrcManagementService } from "@/core/application/services/NrcManagementService";
import { ApiError } from "@/core/infrastructure/api/HttpClient";
import type {
  NrcCode,
  Citizenship,
  NrcComponents,
  NrcNumber,
} from "@/core/domain/entities/Nrc";

/**
 * State interface for NRC management
 */
interface NrcManagementState {
  codes: NrcCode[];
  citizenships: Citizenship[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for NRC management
 * Provides NRC data and utility functions
 */
export function useNrc() {
  // Get service from container
  const nrcService = useMemo(
    () => container.resolve<NrcManagementService>(TOKENS.NRC_SERVICE),
    []
  );

  const [state, setState] = useState<NrcManagementState>({
    codes: [],
    citizenships: [],
    isLoading: false,
    error: null,
  });

  /**
   * Fetch NRC codes and citizenships
   */
  const fetchNrcCodes = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { codes, citizenships } = await nrcService.getNrcCodes();
      setState({
        codes,
        citizenships,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Failed to load NRC codes";
      setState({
        codes: [],
        citizenships: [],
        isLoading: false,
        error: errorMessage,
      });
    }
  }, [nrcService]);

  /**
   * Parse NRC number into components
   */
  const parseNrcNumber = useCallback(
    (nrcNumber: NrcNumber): NrcComponents | null => {
      return nrcService.parseNrcNumber(nrcNumber);
    },
    [nrcService]
  );

  /**
   * Build NRC number from components
   */
  const buildNrcNumber = useCallback(
    (components: NrcComponents): NrcNumber => {
      return nrcService.buildNrcNumber(components);
    },
    [nrcService]
  );

  /**
   * Validate NRC number format
   */
  const isValidNrcFormat = useCallback(
    (nrcNumber: NrcNumber): boolean => {
      return nrcService.isValidNrcFormat(nrcNumber);
    },
    [nrcService]
  );

  /**
   * Get citizenship options
   */
  const citizenshipOptions = useMemo(() => {
    return nrcService.getCitizenshipOptions();
  }, [nrcService]);

  /**
   * Get NRC code options for dropdown
   */
  const nrcCodeOptions = useMemo(() => {
    return state.codes.map((code) => ({
      value: code.nrc_code,
      label: `${code.nrc_code} - ${code.name_en}`,
      nameEn: code.name_en,
      nameMm: code.name_mm,
    }));
  }, [state.codes]);

  /**
   * Get NrcCode by code
   */
  const getNrcCodeByValue = useCallback(
    (code: string): NrcCode | undefined => {
      return state.codes.find((c) => c.nrc_code === code);
    },
    [state.codes]
  );

  // Auto-fetch NRC codes on mount
  useEffect(() => {
    fetchNrcCodes();
  }, [fetchNrcCodes]);

  return {
    // State
    codes: state.codes,
    citizenships: state.citizenships,
    isLoading: state.isLoading,
    error: state.error,

    // Options for dropdowns
    nrcCodeOptions,
    citizenshipOptions,

    // Actions
    fetchNrcCodes,
    parseNrcNumber,
    buildNrcNumber,
    isValidNrcFormat,
    getNrcCodeByValue,
  };
}
