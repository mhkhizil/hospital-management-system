import { TokenManagementService } from "@/core/infrastructure/services/TokenManagementService";
import { HttpClient } from "@/core/infrastructure/api/HttpClient";
import { ApiPatientRepository } from "@/core/infrastructure/repositories/ApiPatientRepository";
import { ApiDoctorRepository } from "@/core/infrastructure/repositories/ApiDoctorRepository";
import { ApiAppointmentRepository } from "@/core/infrastructure/repositories/ApiAppointmentRepository";
import { ApiAuthRepository } from "@/core/infrastructure/repositories/ApiAuthRepository";
import { ApiUserRepository } from "@/core/infrastructure/repositories/ApiUserRepository";
import { ApiAdmissionRepository } from "@/core/infrastructure/repositories/ApiAdmissionRepository";
import { ApiStaffRepository } from "@/core/infrastructure/repositories/ApiStaffRepository";
import { PatientManagementService } from "@/core/application/services/PatientManagementService";
import { DoctorManagementService } from "@/core/application/services/DoctorManagementService";
import { AppointmentManagementService } from "@/core/application/services/AppointmentManagementService";
import { AuthManagementService } from "@/core/application/services/AuthManagementService";
import { UserManagementService } from "@/core/application/services/UserManagementService";
import { AdmissionManagementService } from "@/core/application/services/AdmissionManagementService";
import { StaffManagementService } from "@/core/application/services/StaffManagementService";

type Factory<T> = () => T;

class Container {
  private readonly registry = new Map<string, Factory<unknown>>();
  private readonly singletons = new Map<string, unknown>();

  register<T>(token: string, factory: Factory<T>) {
    this.registry.set(token, factory);
  }

  resolve<T>(token: string): T {
    if (this.singletons.has(token)) {
      return this.singletons.get(token) as T;
    }

    const factory = this.registry.get(token);
    if (!factory) {
      throw new Error(`Token ${token} is not registered in the container`);
    }
    const instance = factory();
    this.singletons.set(token, instance);
    return instance as T;
  }

  /**
   * Clear a singleton instance (useful for logout)
   */
  clearSingleton(token: string): void {
    this.singletons.delete(token);
  }

  /**
   * Clear all singleton instances
   */
  clearAllSingletons(): void {
    this.singletons.clear();
  }
}

export const TOKENS = {
  // Infrastructure services
  TOKEN_SERVICE: "TOKEN_SERVICE",
  HTTP_CLIENT: "HTTP_CLIENT",

  // Repositories
  AUTH_REPOSITORY: "AUTH_REPOSITORY",
  PATIENT_REPOSITORY: "PATIENT_REPOSITORY",
  DOCTOR_REPOSITORY: "DOCTOR_REPOSITORY",
  APPOINTMENT_REPOSITORY: "APPOINTMENT_REPOSITORY",
  USER_REPOSITORY: "USER_REPOSITORY",
  ADMISSION_REPOSITORY: "ADMISSION_REPOSITORY",
  STAFF_REPOSITORY: "STAFF_REPOSITORY",

  // Application services
  AUTH_SERVICE: "AUTH_SERVICE",
  PATIENT_SERVICE: "PATIENT_SERVICE",
  DOCTOR_SERVICE: "DOCTOR_SERVICE",
  APPOINTMENT_SERVICE: "APPOINTMENT_SERVICE",
  USER_SERVICE: "USER_SERVICE",
  ADMISSION_SERVICE: "ADMISSION_SERVICE",
  STAFF_SERVICE: "STAFF_SERVICE",
} as const;

export const container = new Container();

export function setupContainer() {
  // Infrastructure services
  container.register(TOKENS.TOKEN_SERVICE, () => new TokenManagementService());

  container.register(
    TOKENS.HTTP_CLIENT,
    () => new HttpClient(container.resolve(TOKENS.TOKEN_SERVICE))
  );

  // Repositories
  container.register(
    TOKENS.AUTH_REPOSITORY,
    () => new ApiAuthRepository(container.resolve(TOKENS.HTTP_CLIENT))
  );
  container.register(
    TOKENS.PATIENT_REPOSITORY,
    () => new ApiPatientRepository(container.resolve(TOKENS.HTTP_CLIENT))
  );
  container.register(
    TOKENS.DOCTOR_REPOSITORY,
    () => new ApiDoctorRepository(container.resolve(TOKENS.HTTP_CLIENT))
  );
  container.register(
    TOKENS.APPOINTMENT_REPOSITORY,
    () => new ApiAppointmentRepository(container.resolve(TOKENS.HTTP_CLIENT))
  );
  container.register(
    TOKENS.USER_REPOSITORY,
    () => new ApiUserRepository(container.resolve(TOKENS.HTTP_CLIENT))
  );

  // Application services
  container.register(
    TOKENS.AUTH_SERVICE,
    () =>
      new AuthManagementService(
        container.resolve(TOKENS.AUTH_REPOSITORY),
        container.resolve(TOKENS.TOKEN_SERVICE)
      )
  );
  container.register(
    TOKENS.PATIENT_SERVICE,
    () =>
      new PatientManagementService(container.resolve(TOKENS.PATIENT_REPOSITORY))
  );
  container.register(
    TOKENS.DOCTOR_SERVICE,
    () =>
      new DoctorManagementService(container.resolve(TOKENS.DOCTOR_REPOSITORY))
  );
  container.register(
    TOKENS.APPOINTMENT_SERVICE,
    () =>
      new AppointmentManagementService(
        container.resolve(TOKENS.APPOINTMENT_REPOSITORY)
      )
  );
  container.register(
    TOKENS.USER_SERVICE,
    () => new UserManagementService(container.resolve(TOKENS.USER_REPOSITORY))
  );

  // Admission repositories
  container.register(
    TOKENS.ADMISSION_REPOSITORY,
    () => new ApiAdmissionRepository(container.resolve(TOKENS.HTTP_CLIENT))
  );
  container.register(
    TOKENS.STAFF_REPOSITORY,
    () => new ApiStaffRepository(container.resolve(TOKENS.HTTP_CLIENT))
  );

  // Admission services
  container.register(
    TOKENS.ADMISSION_SERVICE,
    () => new AdmissionManagementService(container.resolve(TOKENS.ADMISSION_REPOSITORY))
  );
  container.register(
    TOKENS.STAFF_SERVICE,
    () => new StaffManagementService(container.resolve(TOKENS.STAFF_REPOSITORY))
  );
}

setupContainer();
