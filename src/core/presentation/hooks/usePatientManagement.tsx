import { useState, useCallback, useMemo } from "react";
import { container, TOKENS } from "@/core/infrastructure/di/container";
import type { PatientManagementService } from "@/core/application/services/PatientManagementService";
import type {
  PatientListDTO,
  PatientDetailDTO,
  PatientFormDTO,
  AdmissionDTO,
} from "@/core/application/dtos/PatientDTO";
import type { PatientListParams } from "@/core/domain/entities/Patient";
import { ApiError } from "@/core/infrastructure/api/HttpClient";

/**
 * Patient management hook result type
 */
interface UsePatientManagementResult {
  // Data state
  patients: PatientListDTO[];
  searchResults: PatientListDTO[];
  selectedPatient: PatientDetailDTO | null;
  admissions: AdmissionDTO[];

  // Pagination state
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;

  // Loading states
  isLoading: boolean;
  isSearching: boolean;
  isLoadingPatient: boolean;
  isSubmitting: boolean;

  // Error/success states
  error: string | null;
  successMessage: string | null;

  // Actions
  fetchPatients: (params?: PatientListParams) => Promise<void>;
  searchPatients: (query: string) => Promise<void>;
  getPatient: (id: number) => Promise<void>;
  createPatient: (data: PatientFormDTO) => Promise<PatientListDTO | null>;
  updatePatient: (
    id: number,
    data: PatientFormDTO
  ) => Promise<PatientDetailDTO | null>;
  getAdmissions: (patientId: number) => Promise<void>;
  setPage: (page: number) => void;
  clearError: () => void;
  clearSuccess: () => void;
  clearSelectedPatient: () => void;
  clearSearchResults: () => void;
}

/**
 * Custom hook for patient management operations
 */
export function usePatientManagement(): UsePatientManagementResult {
  const service = useMemo(
    () => container.resolve<PatientManagementService>(TOKENS.PATIENT_SERVICE),
    []
  );

  // Data state
  const [patients, setPatients] = useState<PatientListDTO[]>([]);
  const [searchResults, setSearchResults] = useState<PatientListDTO[]>([]);
  const [selectedPatient, setSelectedPatient] =
    useState<PatientDetailDTO | null>(null);
  const [admissions, setAdmissions] = useState<AdmissionDTO[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(15);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error/success states
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Fetch paginated list of patients
   */
  const fetchPatients = useCallback(
    async (params?: PatientListParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await service.listPatients({
          ...params,
          page: params?.page ?? currentPage,
          per_page: params?.per_page ?? perPage,
        });

        setPatients(result.data);
        setCurrentPage(result.currentPage);
        setLastPage(result.lastPage);
        setTotal(result.total);
        setPerPage(result.perPage);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Failed to fetch patients. Please try again.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [service, currentPage, perPage]
  );

  /**
   * Search patients by name, NRC, or phone
   */
  const searchPatients = useCallback(
    async (query: string) => {
      if (!query.trim() || query.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const result = await service.searchPatients(query);
        setSearchResults(result.data);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Search failed. Please try again.";
        setError(message);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [service]
  );

  /**
   * Get patient details by ID
   */
  const getPatient = useCallback(
    async (id: number) => {
      setIsLoadingPatient(true);
      setError(null);

      try {
        const patient = await service.getPatientById(id);
        setSelectedPatient(patient);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Failed to fetch patient details.";
        setError(message);
        setSelectedPatient(null);
      } finally {
        setIsLoadingPatient(false);
      }
    },
    [service]
  );

  /**
   * Create a new patient
   */
  const createPatient = useCallback(
    async (data: PatientFormDTO): Promise<PatientListDTO | null> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const patient = await service.createPatient(data);
        setSuccessMessage("Patient registered successfully.");
        // Refresh the list
        await fetchPatients({ page: 1 });
        return patient;
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.isValidationError() && err.errors) {
            const errorMessages = Object.values(err.errors).flat().join(", ");
            setError(errorMessages || err.message);
          } else {
            setError(err.message);
          }
        } else {
          setError("Failed to register patient. Please try again.");
        }
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [service, fetchPatients]
  );

  /**
   * Update an existing patient
   */
  const updatePatient = useCallback(
    async (
      id: number,
      data: PatientFormDTO
    ): Promise<PatientDetailDTO | null> => {
      setIsSubmitting(true);
      setError(null);

      try {
        console.log("Updating patient with data:", data);
        const patient = await service.updatePatient(id, data);
        setSuccessMessage("Patient updated successfully.");
        setSelectedPatient(patient);
        // Refresh the list
        await fetchPatients();
        return patient;
      } catch (err) {
        console.error("Update patient error:", err);
        if (err instanceof ApiError) {
          console.error("API Error details:", {
            message: err.message,
            status: err.status,
            errors: err.errors,
          });
          if (err.isValidationError() && err.errors) {
            const errorMessages = Object.values(err.errors).flat().join(", ");
            setError(errorMessages || err.message);
          } else {
            setError(err.message);
          }
        } else {
          setError("Failed to update patient. Please try again.");
        }
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [service, fetchPatients]
  );

  /**
   * Get patient admission history
   */
  const getAdmissions = useCallback(
    async (patientId: number) => {
      setIsLoadingPatient(true);
      setError(null);

      try {
        const history = await service.getPatientAdmissions(patientId);
        setAdmissions(history);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Failed to fetch admission history.";
        setError(message);
        setAdmissions([]);
      } finally {
        setIsLoadingPatient(false);
      }
    },
    [service]
  );

  /**
   * Set current page and refetch
   */
  const setPage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchPatients({ page });
    },
    [fetchPatients]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear success message
   */
  const clearSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  /**
   * Clear selected patient
   */
  const clearSelectedPatient = useCallback(() => {
    setSelectedPatient(null);
    setAdmissions([]);
  }, []);

  /**
   * Clear search results
   */
  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
  }, []);

  return {
    // Data state
    patients,
    searchResults,
    selectedPatient,
    admissions,

    // Pagination state
    currentPage,
    lastPage,
    total,
    perPage,

    // Loading states
    isLoading,
    isSearching,
    isLoadingPatient,
    isSubmitting,

    // Error/success states
    error,
    successMessage,

    // Actions
    fetchPatients,
    searchPatients,
    getPatient,
    createPatient,
    updatePatient,
    getAdmissions,
    setPage,
    clearError,
    clearSuccess,
    clearSelectedPatient,
    clearSearchResults,
  };
}
