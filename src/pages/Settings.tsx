import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
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
    </div>
  );
}


