export class Appointment {
  constructor(
    public readonly id: string,
    public readonly patientName: string,
    public readonly doctorName: string,
    public readonly department: string,
    public readonly scheduledAt: string,
    public readonly status: "pending" | "active" | "completed" | "cancelled"
  ) {}
}
