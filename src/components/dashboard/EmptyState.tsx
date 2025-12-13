import { BarChart3, Calendar, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onRefresh?: () => void;
  dateRange?: {
    start_date: string;
    end_date: string;
  };
}

export function EmptyState({ onRefresh, dateRange }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl">No Data Available</CardTitle>
        <CardDescription className="mt-2">
          {dateRange ? (
            <>
              No data found for the selected date range:
              <br />
              <span className="mt-1 inline-block font-medium">
                {new Date(dateRange.start_date).toLocaleDateString()} -{" "}
                {new Date(dateRange.end_date).toLocaleDateString()}
              </span>
            </>
          ) : (
            "There is no data available for the selected period."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">This could mean:</p>
          <ul className="mx-auto max-w-md space-y-1 text-left">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>No records exist for the selected date range</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>Try adjusting the date range filter</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>Data may not have been generated yet</span>
            </li>
          </ul>
        </div>
        {onRefresh && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button variant="default" onClick={onRefresh}>
              <Calendar className="mr-2 h-4 w-4" />
              Change Date Range
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

