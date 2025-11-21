export class Doctor {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly specialty: string,
    public readonly status: "on-duty" | "off-duty" | "on-leave",
    public readonly extension: string
  ) {}
}


