"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/core/presentation/hooks/useAuth";
import { useAdmissionManagement } from "@/core/presentation/hooks/useAdmissionManagement";
import { usePatientManagement } from "@/core/presentation/hooks/usePatientManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/reassembledComps/data-table";
import { RoleGate } from "@/core/presentation/components/ProtectedRoute";
import {
  getAdmissionColumns,
  AdmissionForm,
  AdmissionEditForm,
  AdmissionDetail,
  DischargeForm,
  ConvertToInpatientForm,
  ConfirmDeathForm,
} from "@/components/admissions";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Search,
  Plus,
  Activity,
  Users,
  UserCheck,
  Bed,
  Eye,
  Edit2,
  LogOut,
  Calendar,
} from "lucide-react";
import type { AdmissionListDTO, AdmissionFormDTO, DischargeFormDTO, ConvertToInpatientFormDTO, ConfirmDeathFormDTO } from "@/core/application/dtos/AdmissionDTO";
import type { PatientListDTO } from "@/core/application/dtos/PatientDTO";
import type { AdmissionStatus, AdmissionType } from "@/core/domain/entities/Admission";

type ViewMode = "list" | "create" | "view" | "edit" | "discharge" | "convert" | "death";

/**
 * Access Denied Component
 */
function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="rounded-full bg-destructive/10 p-6 mb-6">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
      <p className="text-muted-foreground max-w-md">
        You don't have permission to access this section.
      </p>
    </div>
  );
}

/**
 * Patient Search for Admission
 */
function PatientSearch({
  onSelectPatient,
  onCancel,
}: {
  onSelectPatient: (patient: PatientListDTO) => void;
  onCancel: () => void;
}) {
  const { searchPatients, searchResults, isSearching, clearSearchResults } = usePatientManagement();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query.length >= 2) {
      searchPatients(query);
    } else {
      clearSearchResults();
    }
  }, [query, searchPatients, clearSearchResults]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <h3 className="font-semibold">Select Patient for Admission</h3>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patient by name, NRC, or phone..."
          className="pl-9"
          autoFocus
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
        )}
      </div>

      {query.length > 0 && query.length < 2 && (
        <p className="text-xs text-muted-foreground">Type at least 2 characters to search</p>
      )}

      {searchResults.length > 0 && (
        <div className="border rounded-lg divide-y max-h-[400px] overflow-auto">
          {searchResults.map((patient) => (
            <button
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{patient.name}</p>
                  <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                    {patient.nrc_number && <span>NRC: {patient.nrc_number}</span>}
                    {patient.age && <span>Age: {patient.age}</span>}
                    {patient.sex && <span className="capitalize">{patient.sex}</span>}
                  </div>
                </div>
                <Badge variant={patient.admissions_count > 0 ? "default" : "secondary"}>
                  {patient.admissions_count} admissions
                </Badge>
              </div>
            </button>
          ))}
        </div>
      )}

      {query.length >= 2 && !isSearching && searchResults.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No patients found matching "{query}"
        </p>
      )}
    </div>
  );
}

/**
 * Admissions Page Component
 */
export default function AdmissionsPage() {
  const navigate = useNavigate();
  const { hasAnyRole, user } = useAuth();
  const {
    admissions,
    selectedAdmission,
    statistics,
    doctors,
    nurses,
    currentPage,
    lastPage,
    total,
    isLoading,
    isLoadingAdmission,
    isLoadingStats,
    isLoadingStaff,
    isSubmitting,
    error,
    successMessage,
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
  } = useAdmissionManagement();

  // Check user permissions
  const canViewAll = hasAnyRole(["root_user", "admission"]);
  const canCreate = hasAnyRole(["root_user", "admission"]);
  const canUpdate = hasAnyRole(["root_user", "admission", "doctor"]);
  const canDischarge = hasAnyRole(["root_user", "doctor"]);
  const canViewStats = hasAnyRole(["root_user", "admission"]);

  // Get admission ID from URL params
  const [searchParams, setSearchParams] = useSearchParams();
  const admissionIdFromUrl = searchParams.get("admissionId");

  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedPatient, setSelectedPatient] = useState<PatientListDTO | null>(null);
  const [statusFilter, setStatusFilter] = useState<AdmissionStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<AdmissionType | "all">("all");
  const [highlightedAdmissionId, setHighlightedAdmissionId] = useState<number | null>(null);

  // Fetch initial data
  useEffect(() => {
    fetchAdmissions({ 
      page: 1,
      status: statusFilter !== "all" ? statusFilter : undefined,
      admission_type: typeFilter !== "all" ? typeFilter : undefined,
    });
    if (canViewStats) {
      fetchStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle admission ID from URL - fetch and view the admission
  useEffect(() => {
    if (admissionIdFromUrl) {
      const id = parseInt(admissionIdFromUrl, 10);
      if (!isNaN(id)) {
        setHighlightedAdmissionId(id);
        // First, ensure we're on the list view to show the highlight
        setViewMode("list");
        
        // Wait for data to load, then show highlight and scroll
        const checkAndHighlight = () => {
          // Check if admission is in the current list
          const admissionInList = admissions.find((a) => a.id === id);
          
          if (admissionInList || !isLoading) {
            // Data is loaded (either found in list or loading finished)
            // Scroll to the admission
            setTimeout(() => {
              const element = document.getElementById(`admission-${id}`);
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }, 100);
            
            // After showing highlight for a bit, fetch and open detail view
            setTimeout(() => {
              getAdmission(id).then((admission) => {
                if (admission) {
                  setViewMode("view");
                }
              });
            }, 1500); // Longer delay to ensure highlight is visible
          } else {
            // Data still loading, check again
            setTimeout(checkAndHighlight, 100);
          }
        };
        
        // Start checking after a brief delay
        setTimeout(checkAndHighlight, 100);
      }
    }
  }, [admissionIdFromUrl, getAdmission, admissions, isLoading]);

  // Fetch staff when creating/editing
  useEffect(() => {
    if ((viewMode === "create" || viewMode === "edit") && doctors.length === 0) {
      fetchStaff();
    }
  }, [viewMode, doctors.length, fetchStaff]);

  // Auto-clear messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(clearSuccess, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccess]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 8000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Handlers
  const handleViewAdmission = useCallback(
    async (admission: AdmissionListDTO) => {
      await getAdmission(admission.id);
      setViewMode("view");
    },
    [getAdmission]
  );

  const handleCreateAdmission = useCallback(
    async (data: AdmissionFormDTO) => {
      if (!selectedPatient) return;
      const result = await createAdmission(selectedPatient.id, data);
      if (result) {
        setViewMode("list");
        setSelectedPatient(null);
        fetchAdmissions({ page: 1 });
        if (canViewStats) fetchStatistics();
      }
    },
    [selectedPatient, createAdmission, fetchAdmissions, fetchStatistics, canViewStats]
  );

  const handleUpdateAdmission = useCallback(
    async (data: Partial<AdmissionFormDTO>) => {
      if (!selectedAdmission) return;
      const result = await updateAdmission(selectedAdmission.id, data);
      if (result) {
        setViewMode("view");
        fetchAdmissions({ page: currentPage });
      }
    },
    [selectedAdmission, updateAdmission, fetchAdmissions, currentPage]
  );

  const handleDischarge = useCallback(
    async (data: DischargeFormDTO) => {
      if (!selectedAdmission) return;
      const result = await dischargePatient(selectedAdmission.id, data);
      if (result) {
        setViewMode("view");
        fetchAdmissions({ page: currentPage });
        if (canViewStats) fetchStatistics();
      }
      // Error is already set by the hook and will be displayed
    },
    [selectedAdmission, dischargePatient, fetchAdmissions, currentPage, fetchStatistics, canViewStats]
  );

  const handleConvertToInpatient = useCallback(
    async (data: ConvertToInpatientFormDTO) => {
      if (!selectedAdmission) return;
      const result = await convertToInpatient(selectedAdmission.id, data);
      if (result) {
        setViewMode("view");
        fetchAdmissions({ page: currentPage });
        if (canViewStats) fetchStatistics();
      }
      // Error is already set by the hook and will be displayed
    },
    [selectedAdmission, convertToInpatient, fetchAdmissions, currentPage, fetchStatistics, canViewStats]
  );

  const handleConfirmDeath = useCallback(
    async (data: ConfirmDeathFormDTO) => {
      if (!selectedAdmission) return;
      const result = await confirmDeath(selectedAdmission.id, data);
      if (result) {
        setViewMode("view");
        fetchAdmissions({ page: currentPage });
        if (canViewStats) fetchStatistics();
      }
      // Error is already set by the hook and will be displayed
    },
    [selectedAdmission, confirmDeath, fetchAdmissions, currentPage, fetchStatistics, canViewStats]
  );

  const handleBackToList = useCallback(() => {
    setViewMode("list");
    setSelectedPatient(null);
    clearSelectedAdmission();
    setHighlightedAdmissionId(null);
    // Clear URL param when going back to list
    setSearchParams({});
  }, [clearSelectedAdmission, setSearchParams]);

  const handleRefresh = useCallback(() => {
    fetchAdmissions({
      page: currentPage,
      status: statusFilter !== "all" ? statusFilter : undefined,
      admission_type: typeFilter !== "all" ? typeFilter : undefined,
    });
    if (canViewStats) fetchStatistics();
  }, [fetchAdmissions, currentPage, statusFilter, typeFilter, fetchStatistics, canViewStats]);

  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      fetchAdmissions({
        page,
        status: statusFilter !== "all" ? statusFilter : undefined,
        admission_type: typeFilter !== "all" ? typeFilter : undefined,
      });
    },
    [setPage, fetchAdmissions, statusFilter, typeFilter]
  );

  const handleFilterChange = useCallback(
    (status: AdmissionStatus | "all", type: AdmissionType | "all") => {
      setStatusFilter(status);
      setTypeFilter(type);
      setPage(1); // Reset to first page when filters change
      fetchAdmissions({
        page: 1,
        status: status !== "all" ? status : undefined,
        admission_type: type !== "all" ? type : undefined,
      });
    },
    [fetchAdmissions, setPage]
  );

  // Table columns and actions
  const columns = useMemo(() => getAdmissionColumns(), []);

  const actions = useMemo(
    () => [
      {
        label: "View Details",
        icon: Eye,
        onClick: handleViewAdmission,
      },
    ],
    [handleViewAdmission]
  );

  // Get row props for highlighting
  const getRowProps = useCallback(
    (admission: AdmissionListDTO) => {
      if (highlightedAdmissionId === admission.id) {
        return {
          id: `admission-${admission.id}`,
          className: "border-2 border-primary bg-primary/5 animate-pulse",
        };
      }
      return {
        id: `admission-${admission.id}`,
      };
    },
    [highlightedAdmissionId]
  );

  // Check access
  if (!hasAnyRole(["root_user", "admission", "doctor", "nurse"])) {
    return <AccessDenied />;
  }

  // Render patient search for new admission
  if (viewMode === "create" && !selectedPatient) {
    return (
      <div className="space-y-6 px-2 sm:px-0">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>New Admission</CardTitle>
          </CardHeader>
          <CardContent>
            <PatientSearch
              onSelectPatient={setSelectedPatient}
              onCancel={handleBackToList}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render admission form
  if (viewMode === "create" && selectedPatient) {
    return (
      <div className="space-y-6 px-2 sm:px-0">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>New Admission</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStaff ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <AdmissionForm
                patient={selectedPatient}
                doctors={doctors}
                nurses={nurses}
                onSubmit={handleCreateAdmission}
                onCancel={handleBackToList}
                isLoading={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render admission detail
  if (viewMode === "view" && selectedAdmission) {
    return (
      <div className="space-y-6 px-2 sm:px-0">
        {/* Messages */}
        {successMessage && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <AdmissionDetail
              admission={selectedAdmission}
              onClose={handleBackToList}
              onEdit={canUpdate ? () => setViewMode("edit") : undefined}
              onDischarge={canDischarge ? () => setViewMode("discharge") : undefined}
              onConvertToInpatient={canUpdate ? () => setViewMode("convert") : undefined}
              onConfirmDeath={canDischarge ? () => setViewMode("death") : undefined}
              onViewTreatment={(treatmentId) => {
                navigate(`/treatments?admissionId=${selectedAdmission.id}&treatmentId=${treatmentId}`);
              }}
              canEdit={canUpdate}
              canDischarge={canDischarge}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render edit form
  if (viewMode === "edit" && selectedAdmission) {
    return (
      <div className="space-y-6 px-2 sm:px-0">
        {/* Messages */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            {isLoadingStaff ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <AdmissionEditForm
                admission={selectedAdmission}
                doctors={doctors}
                nurses={nurses}
                onSubmit={handleUpdateAdmission}
                onCancel={() => setViewMode("view")}
                isLoading={isSubmitting}
                canEditAdmin={hasAnyRole(["root_user", "admission"])}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render discharge form
  if (viewMode === "discharge" && selectedAdmission) {
    return (
      <div className="space-y-6 px-2 sm:px-0">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <Card>
          <CardContent className="pt-6">
            <DischargeForm
              admission={selectedAdmission}
              onSubmit={handleDischarge}
              onCancel={() => setViewMode("view")}
              isLoading={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render convert to inpatient form
  if (viewMode === "convert" && selectedAdmission) {
    return (
      <div className="space-y-6 px-2 sm:px-0">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <Card>
          <CardContent className="pt-6">
            <ConvertToInpatientForm
              admission={selectedAdmission}
              onSubmit={handleConvertToInpatient}
              onCancel={() => setViewMode("view")}
              isLoading={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render confirm death form
  if (viewMode === "death" && selectedAdmission) {
    return (
      <div className="space-y-6 px-2 sm:px-0">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <Card>
          <CardContent className="pt-6">
            <ConfirmDeathForm
              admission={selectedAdmission}
              onSubmit={handleConfirmDeath}
              onCancel={() => setViewMode("view")}
              isLoading={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render list view
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Admission Management
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-semibold">
            Admissions
          </h2>
        </div>

        {/* Statistics Cards */}
        {canViewStats && statistics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Currently Admitted</p>
                    <p className="text-xl font-bold">
                      {isLoadingStats ? "-" : statistics.currently_admitted}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-500/20">
                    <Bed className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Inpatients</p>
                    <p className="text-xl font-bold">
                      {isLoadingStats ? "-" : statistics.currently_admitted_inpatient}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-500/20">
                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Outpatients</p>
                    <p className="text-xl font-bold">
                      {isLoadingStats ? "-" : statistics.currently_admitted_outpatient}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-500/20">
                    <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                    <p className="text-xl font-bold">
                      {isLoadingStats ? "-" : statistics.admissions_this_month}
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
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5" />
                Admission Records
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <RoleGate allowedRoles={["root_user", "admission"]}>
                  <Button onClick={() => setViewMode("create")} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    New Admission
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 sm:max-w-[200px]">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => handleFilterChange(value as AdmissionStatus | "all", typeFilter)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="admitted">Admitted</SelectItem>
                    <SelectItem value="discharged">Discharged</SelectItem>
                    <SelectItem value="deceased">Deceased</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 sm:max-w-[200px]">
                <Select
                  value={typeFilter}
                  onValueChange={(value) => handleFilterChange(statusFilter, value as AdmissionType | "all")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="inpatient">Inpatient</SelectItem>
                    <SelectItem value="outpatient">Outpatient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && admissions.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : admissions.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No admissions found</p>
            </div>
          ) : (
            <DataTable
              data={admissions}
              columns={columns}
              actions={actions}
              currentPage={currentPage}
              totalPages={lastPage}
              onPageChange={handlePageChange}
              isLoading={isLoading}
              getRowProps={getRowProps}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

