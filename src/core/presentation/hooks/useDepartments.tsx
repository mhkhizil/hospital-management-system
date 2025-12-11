"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { container, TOKENS } from "@/core/infrastructure/di/container";
import { DepartmentManagementService } from "@/core/application/services/DepartmentManagementService";
import { ApiError } from "@/core/infrastructure/api/HttpClient";
import type { DepartmentData } from "@/core/domain/entities/Department";

/**
 * State interface for department management
 */
interface DepartmentManagementState {
  departments: DepartmentData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for department management
 * Provides hospital department data and utility functions
 */
export function useDepartments() {
  // Get service from container
  const departmentService = useMemo(
    () => container.resolve<DepartmentManagementService>(TOKENS.DEPARTMENT_SERVICE),
    []
  );

  const [state, setState] = useState<DepartmentManagementState>({
    departments: null,
    isLoading: false,
    error: null,
  });

  /**
   * Fetch hospital departments
   */
  const fetchDepartments = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const departments = await departmentService.getDepartments();
      setState({
        departments,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Failed to load departments";
      setState({
        departments: null,
        isLoading: false,
        error: errorMessage,
      });
    }
  }, [departmentService]);

  /**
   * Get department options for dropdown
   */
  const departmentOptions = useMemo(() => {
    if (!state.departments) return [];
    return Object.entries(state.departments).map(([key, label]) => ({
      value: key,
      label,
    }));
  }, [state.departments]);

  /**
   * Get department label by value
   */
  const getDepartmentLabel = useCallback(
    (value: string): string => {
      if (!state.departments) return value;
      return state.departments[value] || value;
    },
    [state.departments]
  );

  // Auto-fetch departments on mount
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    // State
    departments: state.departments,
    departmentOptions,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    fetchDepartments,
    getDepartmentLabel,
  };
}

