export type PatientStatus = "admitted" | "discharged" | "outpatient";

export class Patient {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly dateOfBirth: string,
    public readonly gender: "male" | "female" | "other",
    public readonly department: string,
    public readonly status: PatientStatus,
    public readonly attendingPhysician: string,
    public readonly lastVisit: string
  ) {}
}


