import * as React from "react";
import { container, TOKENS } from "@/core/infrastructure/di/container";
import type { AppointmentManagementService } from "@/core/application/services/AppointmentManagementService";
import type { AppointmentDTO } from "@/core/application/dtos/AppointmentDTO";

export function useAppointmentManagement() {
  const service = React.useMemo(
    () =>
      container.resolve<AppointmentManagementService>(
        TOKENS.APPOINTMENT_SERVICE
      ),
    []
  );

  const [appointments, setAppointments] = React.useState<AppointmentDTO[]>([]);

  React.useEffect(() => {
    service.listUpcoming().then(setAppointments);
  }, [service]);

  return { appointments };
}
