"use client";

import { useState, useCallback, useMemo } from "react";
import { container, TOKENS } from "@/core/infrastructure/di/container";
import { TreatmentManagementService } from "@/core/application/services/TreatmentManagementService";
import { StaffManagementService } from "@/core/application/services/StaffManagementService";
import { ApiError } from "@/core/infrastructure/api/HttpClient";
import type {
  TreatmentListDTO,
  TreatmentDetailDTO,
  TreatmentFormDTO,
} from "@/core/application/dtos/TreatmentDTO";
import type { Staff } from "@/core/domain/entities/Staff";

/**
 * State interface for treatment management
 */
interface TreatmentManagementState {
  treatments: TreatmentListDTO[];
  selectedTreatment: TreatmentDetailDTO | null;
  admissionInfo: {
    admission_id: number;
    admission_number: string;
    patient_id: number;
    patient_name: string;
  } | null;
  doctors: Staff[];
  nurses: Staff[];
  total: number;
  isLoading: boolean;
  isLoadingTreatment: boolean;
  isLoadingStaff: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;
}

/**
 * Custom hook for treatment management
 * Provides state and actions for managing treatment records
 */
export function useTreatmentManagement() {
  // Get services from container
  const treatmentService = useMemo(
    () =>
      container.resolve<TreatmentManagementService>(TOKENS.TREATMENT_SERVICE),
    []
  );
  const staffService = useMemo(
    () => container.resolve<StaffManagementService>(TOKENS.STAFF_SERVICE),
    []
  );

  // State
  const [state, setState] = useState<TreatmentManagementState>({
    treatments: [],
    selectedTreatment: null,
    admissionInfo: null,
    doctors: [],
    nurses: [],
    total: 0,
    isLoading: false,
    isLoadingTreatment: false,
    isLoadingStaff: false,
    isSubmitting: false,
    error: null,
    successMessage: null,
  });

  // Helper to update state
  const updateState = useCallback(
    (updates: Partial<TreatmentManagementState>) => {
      setState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  /**
   * Fetch treatments for an admission
   */
  const fetchTreatments = useCallback(
    async (admissionId: number) => {
      updateState({ isLoading: true, error: null });

      try {
        const result = await treatmentService.listTreatments(admissionId);
        updateState({
          treatments: result.data,
          total: result.total,
          admissionInfo: {
            admission_id: result.admission_id,
            admission_number: result.admission_number,
            patient_id: result.patient_id,
            patient_name: result.patient_name,
          },
          isLoading: false,
        });
        return result;
      } catch (err) {
        if (err instanceof ApiError) {
          updateState({ error: err.message, isLoading: false });
        } else {
          updateState({
            error: "Failed to fetch treatments.",
            isLoading: false,
          });
        }
        return null;
      }
    },
    [treatmentService, updateState]
  );

  /**
   * Get treatment details
   */
  const getTreatment = useCallback(
    async (
      admissionId: number,
      treatmentId: number
    ): Promise<TreatmentDetailDTO | null> => {
      updateState({ isLoadingTreatment: true, error: null });

      try {
        const treatment = await treatmentService.getTreatmentById(
          admissionId,
          treatmentId
        );
        updateState({
          selectedTreatment: treatment,
          isLoadingTreatment: false,
        });
        return treatment;
      } catch (err) {
        if (err instanceof ApiError) {
          updateState({ error: err.message, isLoadingTreatment: false });
        } else {
          updateState({
            error: "Failed to fetch treatment details.",
            isLoadingTreatment: false,
          });
        }
        return null;
      }
    },
    [treatmentService, updateState]
  );

  /**
   * Create a new treatment record
   */
  const createTreatment = useCallback(
    async (
      admissionId: number,
      data: TreatmentFormDTO
    ): Promise<TreatmentDetailDTO | null> => {
      updateState({ isSubmitting: true, error: null });

      try {
        const treatment = await treatmentService.createTreatment(
          admissionId,
          data
        );
        updateState({
          selectedTreatment: treatment,
          successMessage: "Treatment record created successfully.",
          isSubmitting: false,
        });
        return treatment;
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.isValidationError() && err.errors) {
            const errorMessages = Object.values(err.errors).flat().join(", ");
            updateState({
              error: errorMessages || err.message,
              isSubmitting: false,
            });
          } else {
            updateState({ error: err.message, isSubmitting: false });
          }
        } else {
          updateState({
            error: "Failed to create treatment record.",
            isSubmitting: false,
          });
        }
        return null;
      }
    },
    [treatmentService, updateState]
  );

  /**
   * Update an existing treatment record
   */
  const updateTreatment = useCallback(
    async (
      admissionId: number,
      treatmentId: number,
      data: Partial<TreatmentFormDTO>
    ): Promise<TreatmentDetailDTO | null> => {
      updateState({ isSubmitting: true, error: null });

      try {
        const treatment = await treatmentService.updateTreatment(
          admissionId,
          treatmentId,
          data
        );
        updateState({
          selectedTreatment: treatment,
          successMessage: "Treatment record updated successfully.",
          isSubmitting: false,
        });
        return treatment;
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.isValidationError() && err.errors) {
            const errorMessages = Object.values(err.errors).flat().join(", ");
            updateState({
              error: errorMessages || err.message,
              isSubmitting: false,
            });
          } else {
            updateState({ error: err.message, isSubmitting: false });
          }
        } else {
          updateState({
            error: "Failed to update treatment record.",
            isSubmitting: false,
          });
        }
        return null;
      }
    },
    [treatmentService, updateState]
  );

  /**
   * Fetch staff (doctors and nurses)
   */
  const fetchStaff = useCallback(async () => {
    updateState({ isLoadingStaff: true });

    try {
      const { doctors, nurses } = await staffService.getAllStaff();
      updateState({ doctors, nurses, isLoadingStaff: false });
    } catch (err) {
      console.error("Failed to fetch staff:", err);
      updateState({ isLoadingStaff: false });
    }
  }, [staffService, updateState]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  /**
   * Clear success message
   */
  const clearSuccess = useCallback(() => {
    updateState({ successMessage: null });
  }, [updateState]);

  /**
   * Clear selected treatment
   */
  const clearSelectedTreatment = useCallback(() => {
    updateState({ selectedTreatment: null });
  }, [updateState]);

  /**
   * Clear all treatments
   */
  const clearTreatments = useCallback(() => {
    updateState({
      treatments: [],
      total: 0,
      admissionInfo: null,
    });
  }, [updateState]);

  return {
    // State
    ...state,

    // Actions
    fetchTreatments,
    getTreatment,
    createTreatment,
    updateTreatment,
    fetchStaff,
    clearError,
    clearSuccess,
    clearSelectedTreatment,
    clearTreatments,
  };
}
