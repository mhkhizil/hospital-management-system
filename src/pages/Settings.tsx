import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Download, Server, AlertCircle } from "lucide-react";
import { useAuth } from "@/core/presentation/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();
  const isRootUser = user?.role === "root_user";

  const handleExportDatabase = () => {
    // No actual functionality - just UI
    console.log("Export database to physical server clicked");
    // In a real implementation, this would trigger a backend API call
    // to export the database to a physical server
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Configuration
        </p>
        <h2 className="mt-2 text-3xl font-semibold">System Settings</h2>
      </div>

      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>API Connectivity</CardTitle>
          <CardDescription>
            Configure the base URL and credentials for the hospital information system.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">API Base URL</label>
            <p className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">
              {import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api"}
            </p>
          </div>
          <Button className="w-fit">Configure via .env</Button>
        </CardContent>
      </Card>

      {isRootUser && (
        <Card className="bg-card/70 border-destructive/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-destructive" />
              <CardTitle>Database Management</CardTitle>
            </div>
            <CardDescription>
              Export all database records to physical server for backup and archival purposes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-destructive">
                    Important: Database Export
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This action will export all database records including patients, admissions,
                    treatments, and system data to the physical server. This process may take
                    several minutes depending on the database size. Ensure you have sufficient
                    storage space on the target server.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Target Server</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Physical server location for database export
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Export Format</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  SQL dump file with all tables and data
                </p>
              </div>
            </div>

            <Button
              onClick={handleExportDatabase}
              variant="destructive"
              size="lg"
              className="w-full sm:w-fit"
            >
              <Download className="h-4 w-4 mr-2" />
              Export All Database to Physical Server
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


