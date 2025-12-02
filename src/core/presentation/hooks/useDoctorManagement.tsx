import * as React from "react";
import { container, TOKENS } from "@/core/infrastructure/di/container";
import type { DoctorManagementService } from "@/core/application/services/DoctorManagementService";
import type { DoctorDTO } from "@/core/application/dtos/DoctorDTO";

export function useDoctorManagement() {
  const service = React.useMemo(
    () => container.resolve<DoctorManagementService>(TOKENS.DOCTOR_SERVICE),
    []
  );
  const [doctors, setDoctors] = React.useState<DoctorDTO[]>([]);

  React.useEffect(() => {
    service.listDoctors().then(setDoctors);
  }, [service]);

  return { doctors };
}


