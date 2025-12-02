import React, { type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types for the data table
export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface Action<T> {
  label: string;
  icon?: React.ElementType;
  onClick: (item: T) => void;
  disabled?: (item: T) => boolean;
  variant?: "default" | "destructive" | "secondary";
  rootOnly?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  isLoading?: boolean;
  loadingText?: string;
  emptyText?: string;
  currentUser?: { isRootUser?: () => boolean } | null;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  // Sorting
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  getSortIcon?: (field: string) => ReactNode;
  // Actions
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  // Custom renderers
  renderAvatar?: (item: T) => ReactNode;
  renderStatus?: (item: T) => ReactNode;
  renderDate?: (date: Date | string | undefined) => string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  actions = [],
  isLoading = false,
  loadingText = "Loading...",
  emptyText = "No data found",
  currentUser,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onSort,
  getSortIcon,
  onView,
  onEdit,
  onDelete,
  renderAvatar,
  renderStatus,
  renderDate,
}: DataTableProps<T>) {
  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const renderCell = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item);
    }

    // Default rendering based on column key
    const value = (item as Record<string, unknown>)[column.key];

    if (column.key === "avatar" && renderAvatar) {
      return renderAvatar(item);
    }

    if (column.key === "status" && renderStatus) {
      return renderStatus(item);
    }

    if (column.key.includes("Date") && renderDate) {
      return renderDate(value as string | Date | undefined);
    }

    if (typeof value === "boolean") {
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Yes" : "No"}
        </Badge>
      );
    }

    return (value as ReactNode) || "-";
  };

  if (isLoading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{loadingText}</p>
        </div>
      </div>
    );
  }

  const hasActions = actions.length > 0 || onView || onEdit || onDelete;

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.sortable ? (
                    <button
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      {getSortIcon && getSortIcon(column.key)}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {renderCell(item, column)}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Default actions */}
                          {onView && (
                            <DropdownMenuItem onClick={() => onView(item)}>
                              View
                            </DropdownMenuItem>
                          )}
                          {onEdit && (
                            <DropdownMenuItem
                              onClick={() => onEdit(item)}
                              disabled={
                                currentUser
                                  ? !currentUser.isRootUser?.()
                                  : false
                              }
                              className={
                                currentUser && !currentUser.isRootUser?.()
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }
                            >
                              Edit
                              {currentUser && !currentUser.isRootUser?.() && (
                                <span className="ml-auto text-xs">
                                  (Root Only)
                                </span>
                              )}
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(item)}
                              disabled={
                                currentUser
                                  ? !currentUser.isRootUser?.()
                                  : false
                              }
                              className={cn(
                                "text-destructive",
                                currentUser &&
                                  !currentUser.isRootUser?.() &&
                                  "opacity-50 cursor-not-allowed"
                              )}
                            >
                              Delete
                              {currentUser && !currentUser.isRootUser?.() && (
                                <span className="ml-auto text-xs">
                                  (Root Only)
                                </span>
                              )}
                            </DropdownMenuItem>
                          )}

                          {/* Custom actions */}
                          {actions.map((action, index) => {
                            const isDisabled =
                              action.disabled?.(item) ||
                              (action.rootOnly &&
                                currentUser &&
                                !currentUser.isRootUser?.()) ||
                              false;

                            return (
                              <DropdownMenuItem
                                key={index}
                                onClick={() => action.onClick(item)}
                                disabled={isDisabled}
                                className={cn(
                                  action.variant === "destructive" &&
                                    "text-destructive",
                                  isDisabled && "opacity-50 cursor-not-allowed"
                                )}
                              >
                                {action.icon && (
                                  <action.icon className="mr-2 h-4 w-4" />
                                )}
                                {action.label}
                                {action.rootOnly &&
                                  currentUser &&
                                  !currentUser.isRootUser?.() && (
                                    <span className="ml-auto text-xs">
                                      (Root Only)
                                    </span>
                                  )}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 px-1">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border bg-card p-3 sm:p-4 space-y-3"
            >
              {/* Mobile card content */}
              <div className="space-y-2.5">
                {columns.map((column) => {
                  // Skip hidden columns on mobile
                  if (column.className?.includes("hidden")) return null;
                  
                  return (
                    <div
                      key={column.key}
                      className="flex flex-col gap-1 text-sm"
                    >
                      <span className="text-muted-foreground font-medium text-xs">
                        {column.header}
                      </span>
                      <div className="text-foreground break-words min-w-0">
                        {renderCell(item, column)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile actions */}
              {hasActions && (
                <div className="flex justify-end pt-2 border-t">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <MoreHorizontal className="h-4 w-4 mr-2" />
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(item)}>
                          View
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(item)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                      {actions.map((action, index) => {
                        const isDisabled =
                          action.disabled?.(item) ||
                          (action.rootOnly &&
                            currentUser &&
                            !currentUser.isRootUser?.()) ||
                          false;

                        return (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => action.onClick(item)}
                            disabled={isDisabled}
                            className={cn(
                              action.variant === "destructive" &&
                                "text-destructive",
                              isDisabled && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {action.icon && (
                              <action.icon className="mr-2 h-4 w-4" />
                            )}
                            {action.label}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-2 sm:px-4 py-3 sm:py-4">
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
            results
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>
            <div className="hidden sm:flex items-center space-x-1">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                  }
                  if (pageNum > totalPages) {
                    pageNum = totalPages - 4 + i;
                  }
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-8"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <span className="sm:hidden text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
