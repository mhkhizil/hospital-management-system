import { Badge } from "@/components/ui/badge";
// import { Shield } from "lucide-react";
import type { Column } from "@/components/reassembledComps/data-table";
import type { User } from "@/core/domain/entities/User";
import {
  getRoleBadgeVariant,
  getRoleDisplayName,
  formatDate,
  renderRootUserName,
} from "./utils";

/**
 * Get columns for staff users table
 */
export function getStaffColumns(): Column<User>[] {
  return [
    {
      key: "id",
      header: "ID",
      className: "w-[50px] hidden lg:table-cell",
    },
    {
      key: "name",
      header: "Name",
      className: "min-w-[120px]",
      render: (user) => (
        <div className="font-medium truncate max-w-[150px]">{user.name}</div>
      ),
    },
    {
      key: "email",
      header: "Email",
      className: "min-w-[180px] hidden md:table-cell",
      render: (user) => (
        <div className="text-muted-foreground truncate max-w-[200px]">
          {user.email}
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      className: "w-[100px]",
      render: (user) => (
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {getRoleDisplayName(user.role)}
        </Badge>
      ),
    },
    {
      key: "verified",
      header: "Verified",
      className: "w-[90px] hidden lg:table-cell",
      render: (user) => (
        <Badge variant={user.emailVerifiedAt ? "default" : "secondary"}>
          {user.emailVerifiedAt ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      className: "min-w-[100px] hidden xl:table-cell",
      render: (user) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
  ];
}

/**
 * Get columns for root users table
 */
export function getRootColumns(): Column<User>[] {
  return [
    {
      key: "id",
      header: "ID",
      className: "w-[50px] hidden lg:table-cell",
    },
    {
      key: "name",
      header: "Name",
      className: "min-w-[120px]",
      render: (user) => renderRootUserName(user),
    },
    {
      key: "email",
      header: "Email",
      className: "min-w-[180px] hidden md:table-cell",
      render: (user) => (
        <div className="text-muted-foreground truncate max-w-[200px]">
          {user.email}
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      className: "w-[100px]",
      render: (user) => (
        <Badge variant="destructive">{getRoleDisplayName(user.role)}</Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      className: "min-w-[100px] hidden xl:table-cell",
      render: (user) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
  ];
}

/**
 * Get columns for deleted users table
 */
export function getDeletedUserColumns(): Column<User>[] {
  return [
    {
      key: "id",
      header: "ID",
      className: "w-[50px] hidden lg:table-cell",
    },
    {
      key: "name",
      header: "Name",
      className: "min-w-[120px]",
      render: (user) => (
        <div className="font-medium truncate max-w-[150px]">{user.name}</div>
      ),
    },
    {
      key: "email",
      header: "Email",
      className: "min-w-[180px] hidden md:table-cell",
      render: (user) => (
        <div className="text-muted-foreground truncate max-w-[200px]">
          {user.email}
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      className: "w-[100px]",
      render: (user) => (
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {getRoleDisplayName(user.role)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Deleted",
      className: "min-w-[100px] hidden xl:table-cell",
      render: () => (
        <span className="text-sm text-muted-foreground">Recently deleted</span>
      ),
    },
  ];
}





