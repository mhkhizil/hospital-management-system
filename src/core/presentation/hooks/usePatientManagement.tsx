import * as React from "react";
import { container, TOKENS } from "@/core/infrastructure/di/container";
import type { PatientManagementService } from "@/core/application/services/PatientManagementService";
import type { PatientDTO } from "@/core/application/dtos/PatientDTO";

type UsePatientManagementResult = {
  patients: PatientDTO[];
  searchPatients(query: string): Promise<void>;
  loading: boolean;
};

export function usePatientManagement(): UsePatientManagementResult {
  const service = React.useMemo(
    () => container.resolve<PatientManagementService>(TOKENS.PATIENT_SERVICE),
    []
  );

  const [patients, setPatients] = React.useState<PatientDTO[]>([]);
  const [loading, setLoading] = React.useState(false);

  const loadPatients = React.useCallback(async () => {
    setLoading(true);
    const data = await service.listPatients();
    setPatients(data);
    setLoading(false);
  }, [service]);

  React.useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const handleSearch = React.useCallback(
    async (query: string) => {
      setLoading(true);
      const data = await service.searchPatients(query);
      setPatients(data);
      setLoading(false);
    },
    [service]
  );

  return {
    patients,
    loading,
    searchPatients: handleSearch,
  };
}


