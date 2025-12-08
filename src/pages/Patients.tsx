"use client";

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Eye,
  Edit2,
  X,
  UserCheck,
  UserX,
} from "lucide-react";
import { usePatientManagement } from "@/core/presentation/hooks/usePatientManagement";
import { useAuth } from "@/core/presentation/context/AuthContext";
import { RoleGate } from "@/core/presentation/components/ProtectedRoute";
import { container, TOKENS } from "@/core/infrastructure/di/container";
import type { PatientManagementService } from "@/core/application/services/PatientManagementService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTable } from "@/components/reassembledComps/data-table";
import {
  getPatientColumns,
  PatientForm,
  PatientDetail,
} from "@/components/patients";
import type { PatientListDTO } from "@/core/application/dtos/PatientDTO";
import type { PatientFormDTO } from "@/core/application/dtos/PatientDTO";

type ViewMode = "list" | "create" | "view" | "edit";

/**
 * Access Denied Component for unauthorized users
 */
function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="rounded-full bg-destructive/10 p-6 mb-6">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
      <p className="text-muted-foreground max-w-md">
        You don't have permission to access the patient management section. This
        area is restricted to admission staff and administrators.
      </p>
    </div>
  );
}

/**
 * Patients Page Component
 * Handles patient listing, search, creation, and management
 */
export default function PatientsPage() {
  const navigate = useNavigate();
  const { hasAnyRole } = useAuth();
  const {
    patients,
    searchResults,
    selectedPatient,
    admissions,
    currentPage,
    lastPage,
    total,
    isLoading,
    isSearching,
    isLoadingPatient,
    isSubmitting,
    error,
    successMessage,
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
  } = usePatientManagement();

  // Check user permissions
  // All authenticated users can view patients (backend filters by role)
  // - root_user/admission: See all patients
  // - doctor/nurse: See only their assigned patients
  const canAccess = hasAnyRole(["root_user", "admission", "doctor", "nurse"]);
  // Only root_user and admission can register/edit patients
  const canRegisterEdit = hasAnyRole(["root_user", "admission"]);
  // Check if user sees all patients or only assigned ones
  const seesAllPatients = hasAnyRole(["root_user", "admission"]);

  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [_, setEditingPatient] = useState<PatientListDTO | null>(null);

  // Stats totals (independent of pagination and filters)
  const [statsTotals, setStatsTotals] = useState({
    totalPatients: 0,
    totalAdmitted: 0, // Patients who have ever been admitted (admissions_count > 0)
    totalNotAdmittedYet: 0, // Patients who have never been admitted (admissions_count === 0)
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchPatients(debouncedQuery);
    } else if (debouncedQuery.length === 0) {
      clearSearchResults();
    }
  }, [debouncedQuery, searchPatients, clearSearchResults]);

  // Function to load stats totals (independent of pagination/filters)
  const loadStatsTotals = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      // Use service directly to fetch totals without affecting main patient list
      const service = container.resolve<PatientManagementService>(
        TOKENS.PATIENT_SERVICE
      );

      // Fetch all patients total
      const allPatientsResult = await service.listPatients({
        page: 1,
        per_page: 1,
      });
      const totalPatients = allPatientsResult.total;

      // Fetch all patients data to count by admissions_count
      // This tells us who has ever been admitted vs who hasn't
      let totalNotAdmittedYet = 0;

      if (totalPatients > 0) {
        // Fetch patients in batches to count those with admissions_count === 0
        const batchSize = 100;
        const totalPages = Math.ceil(totalPatients / batchSize);

        for (let page = 1; page <= totalPages; page++) {
          const pageData = await service.listPatients({
            page,
            per_page: batchSize,
          });
          // Count patients who have never been admitted (admissions_count === 0)
          totalNotAdmittedYet += pageData.data.filter(
            (p) => p.admissions_count === 0
          ).length;
        }
      }

      const totalAdmitted = totalPatients - totalNotAdmittedYet;

      setStatsTotals({
        totalPatients,
        totalAdmitted, // Patients who have ever been admitted
        totalNotAdmittedYet, // Patients who have never been admitted
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Fetch stats totals once on mount (independent of pagination/filters)
  useEffect(() => {
    if (canAccess) {
      loadStatsTotals();
    }
  }, [canAccess, loadStatsTotals]);

  // Initial load - only run once on mount
  useEffect(() => {
    if (canAccess) {
      fetchPatients({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccess]);

  // Auto-clear messages
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        clearSuccess();
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, clearSuccess, clearError]);

  // Handlers
  const handleViewPatient = useCallback(
    async (patient: PatientListDTO) => {
      await getPatient(patient.id);
      await getAdmissions(patient.id);
      setViewMode("view");
    },
    [getPatient, getAdmissions]
  );

  const handleEditPatient = useCallback(
    async (patient: PatientListDTO) => {
      await getPatient(patient.id);
      setEditingPatient(patient);
      setViewMode("edit");
    },
    [getPatient]
  );

  const handleCreatePatient = useCallback(
    async (data: PatientFormDTO) => {
      const result = await createPatient(data);
      if (result) {
        setViewMode("list");
        // Refresh stats totals after creating a patient
        loadStatsTotals();
      }
    },
    [createPatient, loadStatsTotals]
  );

  const handleUpdatePatient = useCallback(
    async (data: PatientFormDTO) => {
      if (!selectedPatient) return;
      const result = await updatePatient(selectedPatient.id, data);
      if (result) {
        setViewMode("list");
        setEditingPatient(null);
        // Refresh stats totals after updating a patient (in case admission status changed)
        loadStatsTotals();
      }
      // If update failed, error is already set by the hook and displayed in UI
      // Don't throw - just keep user on the form so they can see the error and fix it
    },
    [selectedPatient, updatePatient, loadStatsTotals]
  );

  const handleBackToList = useCallback(() => {
    setViewMode("list");
    setEditingPatient(null);
    clearSelectedPatient();
    clearError();
  }, [clearSelectedPatient, clearError]);

  const handleRefresh = useCallback(() => {
    fetchPatients({ page: currentPage });
  }, [fetchPatients, currentPage]);

  // Access check
  if (!canAccess) {
    return <AccessDenied />;
  }

  // Get table columns and actions
  const columns = getPatientColumns();
  const actions = [
    {
      label: "View Details",
      icon: Eye,
      onClick: handleViewPatient,
    },
    ...(canRegisterEdit
      ? [
          {
            label: "Edit Patient",
            icon: Edit2,
            onClick: handleEditPatient,
          },
        ]
      : []),
  ];

  // Determine which data to display
  const displayData = debouncedQuery.length >= 2 ? searchResults : patients;

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {seesAllPatients ? "Patient Management" : "My Assigned Patients"}
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-semibold">
            {viewMode === "create"
              ? "Register New Patient"
              : viewMode === "view"
              ? "Patient Details"
              : viewMode === "edit"
              ? "Edit Patient"
              : seesAllPatients
              ? "Patient Registry"
              : "Patient List"}
          </h2>
        </div>

        {/* Quick Stats - Only show on list view */}
        {viewMode === "list" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {seesAllPatients ? "Total Patients" : "My Patients"}
                    </p>
                    <p className="text-xl font-bold">
                      {isLoadingStats ? "-" : statsTotals.totalPatients}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-500/20">
                    <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Admitted</p>
                    <p className="text-xl font-bold">
                      {isLoadingStats ? "-" : statsTotals.totalAdmitted}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hidden sm:block bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-500/20">
                    <UserX className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Not Admitted Yet
                    </p>
                    <p className="text-xl font-bold">
                      {isLoadingStats ? "-" : statsTotals.totalNotAdmittedYet}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="flex items-start gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-3 sm:p-4 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="break-words">{successMessage}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 ml-auto -mr-1"
            onClick={clearSuccess}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 sm:p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="break-words">{error}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 ml-auto -mr-1"
            onClick={clearError}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Main Content */}
      {viewMode === "list" && (
        <Card className="bg-card/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  {seesAllPatients ? "Patient Registry" : "My Patients"}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <RoleGate allowedRoles={["root_user", "admission"]}>
                    <Button
                      onClick={() => setViewMode("create")}
                      className="w-full sm:w-auto"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Register Patient
                    </Button>
                  </RoleGate>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, NRC, or phone..."
                  className="pl-9"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>

              {/* Search hint */}
              {searchQuery.length > 0 && searchQuery.length < 2 && (
                <p className="text-xs text-muted-foreground">
                  Type at least 2 characters to search
                </p>
              )}
              {debouncedQuery.length >= 2 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Found {searchResults.length} result(s) for "{debouncedQuery}
                    "
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      clearSearchResults();
                    }}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-4 lg:p-6 pt-0">
            <DataTable
              data={displayData}
              columns={columns}
              actions={actions}
              isLoading={isLoading || isSearching}
              loadingText="Loading patients..."
              emptyText={
                debouncedQuery.length >= 2
                  ? "No patients found matching your search."
                  : "No patients registered yet."
              }
              currentPage={currentPage}
              totalPages={lastPage}
              totalItems={total}
              pageSize={15}
              onPageChange={debouncedQuery.length >= 2 ? undefined : setPage}
            />
          </CardContent>
        </Card>
      )}

      {viewMode === "create" && (
        <Card className="bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Register New Patient
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={handleBackToList}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PatientForm
              onSubmit={handleCreatePatient}
              onCancel={handleBackToList}
              isLoading={isSubmitting}
            />
          </CardContent>
        </Card>
      )}

      {viewMode === "view" && selectedPatient && (
        <Card className="bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <PatientDetail
              patient={selectedPatient}
              admissions={admissions}
              onClose={handleBackToList}
              onEdit={canRegisterEdit ? () => setViewMode("edit") : undefined}
              onViewAdmission={(admissionId) => {
                navigate(`/admissions?admissionId=${admissionId}`);
              }}
              canEdit={canRegisterEdit}
              isLoadingAdmissions={isLoadingPatient}
            />
          </CardContent>
        </Card>
      )}

      {viewMode === "edit" && selectedPatient && (
        <Card className="bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Edit2 className="h-5 w-5" />
                Edit Patient - {selectedPatient.name}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={handleBackToList}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PatientForm
              initialData={selectedPatient}
              onSubmit={handleUpdatePatient}
              onCancel={handleBackToList}
              isLoading={isSubmitting}
            />
          </CardContent>
        </Card>
      )}

      {/* Loading overlay for patient details */}
      {isLoadingPatient && viewMode !== "list" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading patient data...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
