"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { container, TOKENS } from "@/core/infrastructure/di/container";
import { WardManagementService } from "@/core/application/services/WardManagementService";
import { ApiError } from "@/core/infrastructure/api/HttpClient";
import type { WardsData, WardData } from "@/core/domain/entities/Ward";

/**
 * State interface for ward management
 */
interface WardManagementState {
  wards: WardsData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for ward management
 * Provides hospital ward and room data and utility functions
 */
export function useWards() {
  // Get service from container
  const wardService = useMemo(
    () => container.resolve<WardManagementService>(TOKENS.WARD_SERVICE),
    []
  );

  const [state, setState] = useState<WardManagementState>({
    wards: null,
    isLoading: false,
    error: null,
  });

  /**
   * Fetch hospital wards
   */
  const fetchWards = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const wards = await wardService.getWards();
      setState({
        wards,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Failed to load wards";
      setState({
        wards: null,
        isLoading: false,
        error: errorMessage,
      });
    }
  }, [wardService]);

  /**
   * Get ward options for dropdown
   */
  const wardOptions = useMemo(() => {
    if (!state.wards) return [];
    return wardService.getWardOptions(state.wards);
  }, [state.wards, wardService]);

  /**
   * Get rooms for a specific ward
   */
  const getRoomsForWard = useCallback(
    (wardKey: string): string[] => {
      if (!state.wards || !wardKey) return [];
      return state.wards[wardKey]?.rooms || [];
    },
    [state.wards]
  );

  /**
   * Get room options for dropdown
   */
  const getRoomOptionsForWard = useCallback(
    (wardKey: string) => {
      if (!state.wards || !wardKey) return [];
      const wardData = state.wards[wardKey];
      return wardService.getRoomOptions(wardData);
    },
    [state.wards, wardService]
  );

  /**
   * Get ward name by key
   */
  const getWardName = useCallback(
    (wardKey: string): string => {
      if (!state.wards || !wardKey) return wardKey;
      return state.wards[wardKey]?.name || wardKey;
    },
    [state.wards]
  );

  // Auto-fetch wards on mount
  useEffect(() => {
    fetchWards();
  }, [fetchWards]);

  return {
    // State
    wards: state.wards,
    wardOptions,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    fetchWards,
    getRoomsForWard,
    getRoomOptionsForWard,
    getWardName,
  };
}

