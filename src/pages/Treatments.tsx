"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/core/presentation/hooks/useAuth";
import { useTreatmentManagement } from "@/core/presentation/hooks/useTreatmentManagement";
import { useAdmissionManagement } from "@/core/presentation/hooks/useAdmissionManagement";
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
  getTreatmentColumns,
  TreatmentDetail,
  TreatmentForm,
} from "@/components/treatments";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Search,
  Plus,
  Activity,
  Eye,
  Edit2,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import type {
  TreatmentListDTO,
  TreatmentFormDTO,
} from "@/core/application/dtos/TreatmentDTO";
import type { AdmissionListDTO } from "@/core/application/dtos/AdmissionDTO";

type ViewMode = "select-admission" | "list" | "create" | "view" | "edit";

/**
 * Access Denied Component
 */
function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
      <p className="text-muted-foreground max-w-md">
        You don't have permission to access treatment records. Please contact your
        administrator if you believe this is an error.
      </p>
    </div>
  );
}

/**
 * Admission Search Component
 */
function AdmissionSearch({
  onSelectAdmission,
}: {
  onSelectAdmission: (admission: AdmissionListDTO) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const {
    admissions,
    currentPage: hookCurrentPage,
    lastPage,
    total,
    isLoading,
    fetchAdmissions,
    setPage,
  } = useAdmissionManagement();

  // Sync local page state with hook
  useEffect(() => {
    setCurrentPage(hookCurrentPage);
  }, [hookCurrentPage]);

  useEffect(() => {
    fetchAdmissions({ page: currentPage, status: "admitted" });
  }, [fetchAdmissions, currentPage]);

  const filteredAdmissions = useMemo(() => {
    if (!searchQuery.trim()) return admissions;
    const query = searchQuery.toLowerCase();
    return admissions.filter(
      (a) =>
        a.admission_number.toLowerCase().includes(query) ||
        a.patient?.name?.toLowerCase().includes(query) ||
        a.patient?.nrc_number?.toLowerCase().includes(query)
    );
  }, [admissions, searchQuery]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      setPage(page);
      fetchAdmissions({ page, status: "admitted" });
    },
    [setPage, fetchAdmissions]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">Select an Admission</h3>
        <p className="text-sm text-muted-foreground">
          Choose an active admission to view or add treatment records.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by admission number, patient name, or NRC..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredAdmissions.length === 0 && !searchQuery ? (
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No active admissions found</p>
        </div>
      ) : (
        <>
          {searchQuery && filteredAdmissions.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              <p>No admissions found matching "{searchQuery}"</p>
              <p className="text-xs mt-1">Try a different search term or check other pages</p>
            </div>
          )}
          {filteredAdmissions.length > 0 && (
            <>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {filteredAdmissions.map((admission) => (
            <button
              key={admission.id}
              onClick={() => onSelectAdmission(admission)}
              className="w-full p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold">
                      {admission.admission_number}
                    </span>
                    <Badge
                      variant={
                        admission.admission_type === "inpatient"
                          ? "default"
                          : "outline"
                      }
                      className="capitalize"
                    >
                      {admission.admission_type}
                    </Badge>
                  </div>
                  {admission.patient && (
                    <p className="text-sm font-medium mt-1">
                      {admission.patient.name}
                    </p>
                  )}
                  {admission.admitted_for && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {admission.admitted_for}
                    </p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {admission.admission_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(admission.admission_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
              </div>

              {/* Pagination */}
              {!searchQuery && lastPage > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing page {currentPage} of {lastPage} ({total} total)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                        let pageNum: number;
                        if (lastPage <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= lastPage - 2) {
                          pageNum = lastPage - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isLoading}
                            className="min-w-[40px]"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === lastPage || isLoading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Treatments Page Component
 */
export default function TreatmentsPage() {
  const { hasAnyRole, user } = useAuth();
  const {
    treatments,
    selectedTreatment,
    admissionInfo,
    doctors,
    nurses,
    total,
    isLoading,
    isLoadingTreatment,
    isLoadingStaff,
    isSubmitting,
    error,
    successMessage,
    fetchTreatments,
    getTreatment,
    createTreatment,
    updateTreatment,
    fetchStaff,
    clearError,
    clearSuccess,
    clearSelectedTreatment,
    clearTreatments,
  } = useTreatmentManagement();

  // Get admission ID and treatment ID from URL params
  const [searchParams, setSearchParams] = useSearchParams();
  const admissionIdFromUrl = searchParams.get("admissionId");
  const treatmentIdFromUrl = searchParams.get("treatmentId");

  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>("select-admission");
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionListDTO | null>(null);
  const [currentAdmissionId, setCurrentAdmissionId] = useState<number | null>(null);
  const [highlightedTreatmentId, setHighlightedTreatmentId] = useState<number | null>(null);

  // Role-based permissions
  // View: all roles (filtered by backend)
  // Create: root_user, doctor (assigned only)
  // Update: root_user, doctor (assigned only)
  const canCreate = hasAnyRole(["root_user", "doctor"]);
  const canUpdate = hasAnyRole(["root_user", "doctor"]);

  // Handle admission ID and treatment ID from URL
  useEffect(() => {
    if (admissionIdFromUrl) {
      const id = parseInt(admissionIdFromUrl, 10);
      if (!isNaN(id)) {
        setCurrentAdmissionId(id);
        fetchTreatments(id).then(() => {
          setViewMode("list");
          
          // If treatment ID is also provided, highlight and open it
          if (treatmentIdFromUrl) {
            const treatmentId = parseInt(treatmentIdFromUrl, 10);
            if (!isNaN(treatmentId)) {
              setHighlightedTreatmentId(treatmentId);
              // Wait for data to load, then open treatment detail
              setTimeout(() => {
                getTreatment(id, treatmentId).then((treatment) => {
                  if (treatment) {
                    setViewMode("view");
                    // Scroll to the treatment in the list
                    setTimeout(() => {
                      const element = document.getElementById(`treatment-${treatmentId}`);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }, 300);
                  }
                });
              }, 500);
            }
          }
        });
      }
    }
  }, [admissionIdFromUrl, treatmentIdFromUrl, fetchTreatments, getTreatment]);

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
  const handleSelectAdmission = useCallback(
    async (admission: AdmissionListDTO) => {
      setSelectedAdmission(admission);
      setCurrentAdmissionId(admission.id);
      setSearchParams({ admissionId: admission.id.toString() });
      await fetchTreatments(admission.id);
      setViewMode("list");
    },
    [fetchTreatments, setSearchParams]
  );

  const handleViewTreatment = useCallback(
    async (treatment: TreatmentListDTO) => {
      if (!currentAdmissionId) return;
      await getTreatment(currentAdmissionId, treatment.id);
      setViewMode("view");
    },
    [currentAdmissionId, getTreatment]
  );

  const handleCreateTreatment = useCallback(
    async (data: TreatmentFormDTO) => {
      if (!currentAdmissionId) return;
      const result = await createTreatment(currentAdmissionId, data);
      if (result) {
        setViewMode("list");
        fetchTreatments(currentAdmissionId);
      }
    },
    [currentAdmissionId, createTreatment, fetchTreatments]
  );

  const handleUpdateTreatment = useCallback(
    async (data: TreatmentFormDTO) => {
      if (!currentAdmissionId || !selectedTreatment) return;
      const result = await updateTreatment(
        currentAdmissionId,
        selectedTreatment.id,
        data
      );
      if (result) {
        setViewMode("view");
        fetchTreatments(currentAdmissionId);
      }
    },
    [currentAdmissionId, selectedTreatment, updateTreatment, fetchTreatments]
  );

  const handleBackToList = useCallback(() => {
    setViewMode("list");
    clearSelectedTreatment();
    setHighlightedTreatmentId(null);
    // Clear treatment ID from URL when going back to list
    if (treatmentIdFromUrl) {
      setSearchParams({ admissionId: admissionIdFromUrl || "" });
    }
  }, [clearSelectedTreatment, treatmentIdFromUrl, admissionIdFromUrl, setSearchParams]);

  const handleBackToAdmissionSelect = useCallback(() => {
    setViewMode("select-admission");
    setSelectedAdmission(null);
    setCurrentAdmissionId(null);
    clearTreatments();
    setSearchParams({});
  }, [clearTreatments, setSearchParams]);

  const handleRefresh = useCallback(() => {
    if (currentAdmissionId) {
      fetchTreatments(currentAdmissionId);
    }
  }, [currentAdmissionId, fetchTreatments]);

  // Table columns and actions
  const columns = useMemo(() => getTreatmentColumns(), []);

  const actions = useMemo(
    () => [
      {
        label: "View Details",
        icon: Eye,
        onClick: handleViewTreatment,
      },
      ...(canUpdate
        ? [
            {
              label: "Edit",
              icon: Edit2,
              onClick: (treatment: TreatmentListDTO) => {
                if (!currentAdmissionId) return;
                getTreatment(currentAdmissionId, treatment.id).then(() => {
                  setViewMode("edit");
                });
              },
            },
          ]
        : []),
    ],
    [handleViewTreatment, canUpdate, currentAdmissionId, getTreatment]
  );

  // Get row props for highlighting
  const getRowProps = useCallback(
    (treatment: TreatmentListDTO) => {
      if (highlightedTreatmentId === treatment.id) {
        return {
          id: `treatment-${treatment.id}`,
          className: "border-2 border-primary bg-primary/5 animate-pulse",
        };
      }
      return {
        id: `treatment-${treatment.id}`,
      };
    },
    [highlightedTreatmentId]
  );

  // Check access
  if (!hasAnyRole(["root_user", "admission", "doctor", "nurse"])) {
    return <AccessDenied />;
  }

  // Render admission selection
  if (viewMode === "select-admission") {
    return (
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Treatment Records</h1>
            <p className="text-muted-foreground">
              Manage treatment records for patient admissions
            </p>
          </div>
        </div>

        <Card className="bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <AdmissionSearch onSelectAdmission={handleSelectAdmission} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render create form
  if (viewMode === "create") {
    return (
      <div className="space-y-6 px-2 sm:px-0">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card className="bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            {isLoadingStaff ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <TreatmentForm
                doctors={doctors}
                nurses={nurses}
                onSubmit={handleCreateTreatment}
                onCancel={handleBackToList}
                isLoading={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render view detail
  if (viewMode === "view" && selectedTreatment) {
    return (
      <div className="space-y-6 px-2 sm:px-0">
        {/* Messages */}
        {successMessage && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
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

        <Card className="bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <TreatmentDetail
              treatment={selectedTreatment}
              onClose={handleBackToList}
              onEdit={canUpdate ? () => setViewMode("edit") : undefined}
              canEdit={canUpdate}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render edit form
  if (viewMode === "edit" && selectedTreatment) {
    return (
      <div className="space-y-6 px-2 sm:px-0">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Card className="bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            {isLoadingStaff ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <TreatmentForm
                initialData={selectedTreatment}
                doctors={doctors}
                nurses={nurses}
                onSubmit={handleUpdateTreatment}
                onCancel={() => setViewMode("view")}
                isLoading={isSubmitting}
                isEdit
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render list view
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Treatment Records</h1>
          <p className="text-muted-foreground">
            Manage treatment records for patient admissions
          </p>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
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

      {/* Admission Info Card */}
      {admissionInfo && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">
                      {admissionInfo.admission_number}
                    </span>
                    <Badge variant="outline">{total} treatments</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {admissionInfo.patient_name}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToAdmissionSelect}
              >
                Change Admission
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Treatment List Card */}
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Treatment History
            </CardTitle>
            <div className="flex items-center gap-2">
              <RoleGate allowedRoles={["root_user", "doctor"]}>
                <Button onClick={() => setViewMode("create")} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Treatment
                </Button>
              </RoleGate>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RotateCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && treatments.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : treatments.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No treatment records found</p>
              {canCreate && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setViewMode("create")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Treatment
                </Button>
              )}
            </div>
          ) : (
              <DataTable
              data={treatments}
              columns={columns}
              actions={actions}
              isLoading={isLoading}
              getRowProps={getRowProps}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

