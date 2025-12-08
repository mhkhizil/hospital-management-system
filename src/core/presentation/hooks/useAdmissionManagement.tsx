"use client";

import { useState, useCallback, useMemo } from "react";
import { container, TOKENS } from "@/core/infrastructure/di/container";
import { AdmissionManagementService } from "@/core/application/services/AdmissionManagementService";
import { StaffManagementService } from "@/core/application/services/StaffManagementService";
import { ApiError } from "@/core/infrastructure/api/HttpClient";
import type {
  AdmissionListDTO,
  AdmissionDetailDTO,
  AdmissionFormDTO,
  DischargeFormDTO,
  ConvertToInpatientFormDTO,
  ConfirmDeathFormDTO,
} from "@/core/application/dtos/AdmissionDTO";
import type {
  AdmissionStatistics,
  AdmissionListParams,
} from "@/core/domain/entities/Admission";
import type { Staff } from "@/core/domain/entities/Staff";

/**
 * State interface for admission management
 */
interface AdmissionManagementState {
  admissions: AdmissionListDTO[];
  selectedAdmission: AdmissionDetailDTO | null;
  statistics: AdmissionStatistics | null;
  doctors: Staff[];
  nurses: Staff[];
  currentPage: number;
  lastPage: number;
  total: number;
  isLoading: boolean;
  isLoadingAdmission: boolean;
  isLoadingStats: boolean;
  isLoadingStaff: boolean;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;
}

/**
 * Custom hook for admission management
 * Provides state and actions for managing admissions
 */
export function useAdmissionManagement() {
  // Get services from container
  const admissionService = useMemo(
    () =>
      container.resolve<AdmissionManagementService>(TOKENS.ADMISSION_SERVICE),
    []
  );
  const staffService = useMemo(
    () => container.resolve<StaffManagementService>(TOKENS.STAFF_SERVICE),
    []
  );

  // State
  const [state, setState] = useState<AdmissionManagementState>({
    admissions: [],
    selectedAdmission: null,
    statistics: null,
    doctors: [],
    nurses: [],
    currentPage: 1,
    lastPage: 1,
    total: 0,
    isLoading: false,
    isLoadingAdmission: false,
    isLoadingStats: false,
    isLoadingStaff: false,
    isSubmitting: false,
    error: null,
    successMessage: null,
  });

  // Helper to update state
  const updateState = useCallback(
    (updates: Partial<AdmissionManagementState>) => {
      setState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  /**
   * Fetch admissions with pagination and filters
   */
  const fetchAdmissions = useCallback(
    async (params?: AdmissionListParams) => {
      updateState({ isLoading: true, error: null });

      try {
        const result = await admissionService.listAdmissions(params);
        updateState({
          admissions: result.data,
          currentPage: result.currentPage,
          lastPage: result.lastPage,
          total: result.total,
          isLoading: false,
        });
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Failed to fetch admissions.";
        updateState({ error: message, isLoading: false });
      }
    },
    [admissionService, updateState]
  );

  /**
   * Get admission details by ID
   */
  const getAdmission = useCallback(
    async (id: number) => {
      updateState({ isLoadingAdmission: true, error: null });

      try {
        const admission = await admissionService.getAdmissionById(id);
        updateState({
          selectedAdmission: admission,
          isLoadingAdmission: false,
        });
        return admission;
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Failed to fetch admission details.";
        updateState({
          error: message,
          isLoadingAdmission: false,
          selectedAdmission: null,
        });
        return null;
      }
    },
    [admissionService, updateState]
  );

  /**
   * Create a new admission
   */
  const createAdmission = useCallback(
    async (
      patientId: number,
      data: AdmissionFormDTO
    ): Promise<AdmissionDetailDTO | null> => {
      updateState({ isSubmitting: true, error: null });

      try {
        const admission = await admissionService.createAdmission(patientId, {
          admission_type: data.admission_type,
          admission_date: data.admission_date,
          admission_time: data.admission_time,
          admitted_for: data.admitted_for,
          doctor_id: data.doctor_id,
          nurse_id: data.nurse_id,
          present_address: data.present_address,
          referred_by: data.referred_by,
          police_case: data.police_case as "yes" | "no" | undefined,
          service: data.service,
          ward: data.ward,
          bed_number: data.bed_number,
          medical_officer: data.medical_officer,
          initial_diagnosis: data.initial_diagnosis,
          drug_allergy_noted: data.drug_allergy_noted,
          remarks: data.remarks,
        });
        updateState({
          successMessage: `Patient ${
            data.admission_type === "outpatient" ? "visit" : "admission"
          } created successfully.`,
          isSubmitting: false,
        });
        return admission;
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
            error: "Failed to create admission.",
            isSubmitting: false,
          });
        }
        return null;
      }
    },
    [admissionService, updateState]
  );

  /**
   * Update an existing admission
   */
  const updateAdmission = useCallback(
    async (
      id: number,
      data: Partial<AdmissionFormDTO>
    ): Promise<AdmissionDetailDTO | null> => {
      updateState({ isSubmitting: true, error: null });

      try {
        const admission = await admissionService.updateAdmission(id, {
          ...data,
          police_case: data.police_case as "yes" | "no" | undefined,
        });
        updateState({
          selectedAdmission: admission,
          successMessage: "Admission updated successfully.",
          isSubmitting: false,
        });
        return admission;
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
            error: "Failed to update admission.",
            isSubmitting: false,
          });
        }
        return null;
      }
    },
    [admissionService, updateState]
  );

  /**
   * Convert outpatient to inpatient
   */
  const convertToInpatient = useCallback(
    async (
      id: number,
      data: ConvertToInpatientFormDTO
    ): Promise<AdmissionDetailDTO | null> => {
      updateState({ isSubmitting: true, error: null });

      try {
        const admission = await admissionService.convertToInpatient(id, data);
        updateState({
          selectedAdmission: admission,
          successMessage: "Successfully converted to inpatient admission.",
          isSubmitting: false,
        });
        return admission;
      } catch (err) {
        if (err instanceof ApiError) {
          updateState({ error: err.message, isSubmitting: false });
        } else {
          updateState({
            error: "Failed to convert to inpatient.",
            isSubmitting: false,
          });
        }
        return null;
      }
    },
    [admissionService, updateState]
  );

  /**
   * Discharge a patient
   */
  const dischargePatient = useCallback(
    async (
      id: number,
      data: DischargeFormDTO
    ): Promise<AdmissionDetailDTO | null> => {
      updateState({ isSubmitting: true, error: null });

      try {
        const admission = await admissionService.dischargePatient(id, data);
        updateState({
          selectedAdmission: admission,
          successMessage: "Patient discharged successfully.",
          isSubmitting: false,
        });
        return admission;
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
            error: "Failed to discharge patient.",
            isSubmitting: false,
          });
        }
        return null;
      }
    },
    [admissionService, updateState]
  );

  /**
   * Confirm patient death
   */
  const confirmDeath = useCallback(
    async (
      id: number,
      data: ConfirmDeathFormDTO
    ): Promise<AdmissionDetailDTO | null> => {
      updateState({ isSubmitting: true, error: null });

      try {
        const admission = await admissionService.confirmDeath(id, {
          cause_of_death: data.cause_of_death,
          autopsy: data.autopsy as "yes" | "no" | "pending" | undefined,
          time_of_death: data.time_of_death,
          certified_by: data.certified_by,
        });
        updateState({
          selectedAdmission: admission,
          successMessage: "Patient death confirmed.",
          isSubmitting: false,
        });
        return admission;
      } catch (err) {
        if (err instanceof ApiError) {
          updateState({ error: err.message, isSubmitting: false });
        } else {
          updateState({
            error: "Failed to confirm death.",
            isSubmitting: false,
          });
        }
        return null;
      }
    },
    [admissionService, updateState]
  );

  /**
   * Fetch admission statistics
   */
  const fetchStatistics = useCallback(async () => {
    updateState({ isLoadingStats: true, error: null });

    try {
      const stats = await admissionService.getStatistics();
      updateState({ statistics: stats, isLoadingStats: false });
      return stats;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to fetch statistics.";
      updateState({ error: message, isLoadingStats: false });
      return null;
    }
  }, [admissionService, updateState]);

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
   * Set current page
   */
  const setPage = useCallback(
    (page: number) => {
      updateState({ currentPage: page });
    },
    [updateState]
  );

  /**
   * Clear error
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
   * Clear selected admission
   */
  const clearSelectedAdmission = useCallback(() => {
    updateState({ selectedAdmission: null });
  }, [updateState]);

  return {
    // State
    admissions: state.admissions,
    selectedAdmission: state.selectedAdmission,
    statistics: state.statistics,
    doctors: state.doctors,
    nurses: state.nurses,
    currentPage: state.currentPage,
    lastPage: state.lastPage,
    total: state.total,
    isLoading: state.isLoading,
    isLoadingAdmission: state.isLoadingAdmission,
    isLoadingStats: state.isLoadingStats,
    isLoadingStaff: state.isLoadingStaff,
    isSubmitting: state.isSubmitting,
    error: state.error,
    successMessage: state.successMessage,

    // Actions
    fetchAdmissions,
    getAdmission,
    createAdmission,
    updateAdmission,
    convertToInpatient,
    dischargePatient,
    confirmDeath,
    fetchStatistics,
    fetchStaff,
    setPage,
    clearError,
    clearSuccess,
    clearSelectedAdmission,
  };
}
