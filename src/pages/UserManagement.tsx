"use client";

import { useState } from "react";
import {
  UserCog,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield,
  Archive,
  Users,
  RotateCcw,
} from "lucide-react";
import { useUserManagement } from "@/core/presentation/hooks/useUserManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/reassembledComps/data-table";
import { User } from "@/core/domain/entities/User";
import {
  getStaffColumns,
  getRootColumns,
  getDeletedUserColumns,
  getStaffActions,
  getDeletedUserActions,
} from "@/components/users";

/**
 * Confirmation dialog component
 */
function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  isLoading,
  variant = "destructive",
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  variant?: ButtonProps["variant"];
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * User Management Page
 * Root users can view, delete, and manage staff accounts
 */
export default function UserManagementPage() {
  const {
    users,
    deletedUsers,
    isLoading,
    isLoadingDeleted,
    error,
    deletedError,
    actionLoading,
    actionError,
    successMessage,
    deleteUser,
    restoreUser,
    sendPasswordReset,
    clearMessages,
    fetchUsers,
    fetchDeletedUsers,
  } = useUserManagement();

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "delete" | "reset" | "restore";
    user: User | null;
  }>({
    isOpen: false,
    type: "delete",
    user: null,
  });

  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");

  // Handle delete confirmation
  const handleDeleteClick = (user: User) => {
    setConfirmDialog({
      isOpen: true,
      type: "delete",
      user,
    });
  };

  // Handle password reset confirmation
  const handlePasswordResetClick = (user: User) => {
    setConfirmDialog({
      isOpen: true,
      type: "reset",
      user,
    });
  };

  // Handle restore click
  const handleRestoreClick = (user: User) => {
    setConfirmDialog({
      isOpen: true,
      type: "restore",
      user,
    });
  };

  // Handle confirm action
  const handleConfirm = async () => {
    if (!confirmDialog.user) return;

    if (confirmDialog.type === "delete") {
      const success = await deleteUser(confirmDialog.user.id);
      if (success) {
        // Refresh deleted users list
        await fetchDeletedUsers();
        // Switch to deleted tab to show the deleted user
        setActiveTab("deleted");
      }
    } else if (confirmDialog.type === "restore") {
      const success = await restoreUser(confirmDialog.user.id);
      if (success) {
        // Refresh deleted users list
        await fetchDeletedUsers();
        // Switch back to active tab
        setActiveTab("active");
      }
    } else {
      await sendPasswordReset({ user_id: confirmDialog.user.id });
    }

    setConfirmDialog({ isOpen: false, type: "delete", user: null });
  };

  // Handle cancel
  const handleCancel = () => {
    setConfirmDialog({ isOpen: false, type: "delete", user: null });
  };

  // Auto-clear messages after 5 seconds
  if (successMessage || actionError) {
    setTimeout(() => {
      clearMessages();
    }, 5000);
  }

  // Separate root users from other users
  const rootUsers = users.filter((u) => u.role === "root_user");
  const staffUsers = users.filter((u) => u.role !== "root_user");

  // Get columns and actions from separate components
  const staffColumns = getStaffColumns();
  const rootColumns = getRootColumns();
  const deletedUserColumns = getDeletedUserColumns();
  const staffActions = getStaffActions(
    handlePasswordResetClick,
    handleDeleteClick,
    actionLoading
  );
  const deletedUserActions = getDeletedUserActions(
    handleRestoreClick,
    actionLoading
  );

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Administration
          </p>
          <h2 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-semibold truncate">
            User Management
          </h2>
        </div>
        <Button
          onClick={fetchUsers}
          variant="outline"
          disabled={isLoading}
          className="w-full sm:w-auto shrink-0"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="flex items-start sm:items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-3 sm:p-4 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="break-words">{successMessage}</span>
        </div>
      )}

      {(error || deletedError || actionError) && (
        <div className="flex items-start sm:items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 sm:p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span className="break-words">
            {error || deletedError || actionError}
          </span>
        </div>
      )}

      {/* Tabs for Active and Deleted Users */}
      <Card className="bg-card/70">
        <CardHeader className="px-4 sm:px-6 pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
            <UserCog className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">User Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-4 lg:p-6 pt-0">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "active" | "deleted")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Users ({users.length})
              </TabsTrigger>
              <TabsTrigger value="deleted" className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Deleted Users ({deletedUsers.length})
              </TabsTrigger>
            </TabsList>

            {/* Active Users Tab */}
            <TabsContent value="active" className="space-y-6">
              {/* Staff Users Table */}
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Staff Accounts ({staffUsers.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <DataTable
                    data={staffUsers}
                    columns={staffColumns}
                    actions={staffActions}
                    isLoading={isLoading}
                    loadingText="Loading staff accounts..."
                    emptyText="No staff accounts found."
                  />
                </div>
              </div>

              {/* Root Users Table (Read Only) */}
              {rootUsers.length > 0 && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-destructive" />
                      <h3 className="text-sm font-semibold text-muted-foreground">
                        Administrator Accounts ({rootUsers.length})
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Root users cannot be deleted or have their passwords reset
                      through this interface.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <DataTable
                      data={rootUsers}
                      columns={rootColumns}
                      isLoading={isLoading}
                      loadingText="Loading administrators..."
                      emptyText="No administrator accounts found."
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Deleted Users Tab */}
            <TabsContent value="deleted">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  These users have been soft-deleted and can be restored.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDeletedUsers}
                  disabled={isLoadingDeleted}
                  className="shrink-0"
                >
                  {isLoadingDeleted ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCcw className="mr-2 h-4 w-4" />
                  )}
                  Refresh
                </Button>
              </div>
              <div className="overflow-x-auto">
                <DataTable
                  data={deletedUsers}
                  columns={deletedUserColumns}
                  actions={deletedUserActions}
                  isLoading={isLoadingDeleted}
                  loadingText="Loading deleted users..."
                  emptyText="No deleted users found."
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={
          confirmDialog.type === "delete"
            ? "Delete User"
            : confirmDialog.type === "restore"
            ? "Restore User"
            : "Send Password Reset"
        }
        message={
          confirmDialog.type === "delete"
            ? `Are you sure you want to delete ${confirmDialog.user?.name}? The user can be restored later.`
            : confirmDialog.type === "restore"
            ? `Are you sure you want to restore ${confirmDialog.user?.name}? The user will be able to log in again.`
            : `Send a password reset link to ${confirmDialog.user?.email}?`
        }
        confirmLabel={
          confirmDialog.type === "delete"
            ? "Delete"
            : confirmDialog.type === "restore"
            ? "Restore"
            : "Send Reset Link"
        }
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={actionLoading}
        variant={
          confirmDialog.type === "delete"
            ? "destructive"
            : confirmDialog.type === "restore"
            ? "default"
            : "default"
        }
      />
    </div>
  );
}
