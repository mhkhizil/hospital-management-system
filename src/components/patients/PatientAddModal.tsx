import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";

interface PatientAddModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (patientData: any) => void;
}

export default function PatientAddModal({ open, onClose, onAdd }: PatientAddModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    sex: "",
    age: "",
    dob: "",
    permanent_address: "",
    marital_status: "",
    ethnic_group: "",
    religion: "",
    occupation: "",
    prev_admission_date: "",
    nearest_relative_name: "",
    relationship: "",
    referred_by: "",
    police_case: "",
    present_address: "",
    medical_officer: "",
    contact_phone: "",
    service: "",
    ward: "",
    father_name: "",
    admission_date: "",
    admission_time: "",
    mother_name: "",
    discharge_date: "",
    discharge_time: "",
    admitted_for: "",
    drug_allergy: "",
    remarks: "",
    discharge_diagnosis: "",
    other_diagnosis: "",
    external_cause_of_injury: "",
    clinician_summary: "",
    surgical_procedure: "",
    discharge_type: "",
    discharge_status: "",
    cause_of_death: "",
    autopsy: "",
    certify_by: "",
    approved_by: "",
    doctor_id: "",
    nurse_id: "",
    doctor_name: "",
    doctor_signature: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(field, e.target.value);
  };

  const handleTextareaChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(field, e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      lastVisit: new Date().toISOString(),
      id: Date.now().toString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto sm:p-6 p-4">
        <DialogHeader>
          <DialogTitle className="text-xl">Patient Registration</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* -------------------------------- BASIC INFO -------------------------------- */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Basic Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

              <div>
                <Label>Full Name *</Label>
                <Input value={formData.name} onChange={handleInputChange("name")} required />
              </div>

              <div>
                <Label>Sex</Label>
                <Select value={formData.sex} onValueChange={(v) => handleChange("sex", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Age</Label>
                <Input type="number" value={formData.age} onChange={handleInputChange("age")} />
              </div>

              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={formData.dob} onChange={handleInputChange("dob")} />
              </div>

              <div className="col-span-full">
                <Label>Permanent Address</Label>
                <Textarea rows={3} value={formData.permanent_address} onChange={handleTextareaChange("permanent_address")} />
              </div>

              <div>
                <Label>Marital Status</Label>
                <Select value={formData.marital_status} onValueChange={(v) => handleChange("marital_status", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ethnic Group</Label>
                <Input value={formData.ethnic_group} onChange={handleInputChange("ethnic_group")} />
              </div>

              <div>
                <Label>Religion</Label>
                <Input value={formData.religion} onChange={handleInputChange("religion")} />
              </div>

              <div>
                <Label>Occupation</Label>
                <Input value={formData.occupation} onChange={handleInputChange("occupation")} />
              </div>

              <div>
                <Label>Previous Admission Date</Label>
                <Input type="date" value={formData.prev_admission_date} onChange={handleInputChange("prev_admission_date")} />
              </div>
            </div>
          </section>

          {/* -------------------------------- CONTACT INFO -------------------------------- */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Contact & Relative Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

              <div className="col-span-full">
                <Label>Nearest Relative / Friend Name</Label>
                <Input value={formData.nearest_relative_name} onChange={handleInputChange("nearest_relative_name")} />
              </div>

              <div>
                <Label>Relationship</Label>
                <Input value={formData.relationship} onChange={handleInputChange("relationship")} />
              </div>

              <div>
                <Label>Referred By</Label>
                <Input value={formData.referred_by} onChange={handleInputChange("referred_by")} />
              </div>

              <div>
                <Label>Police Case</Label>
                <Select value={formData.police_case} onValueChange={(v) => handleChange("police_case", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-full">
                <Label>Present Address</Label>
                <Textarea rows={3} value={formData.present_address} onChange={handleTextareaChange("present_address")} />
              </div>

              <div>
                <Label>Medical Officer</Label>
                <Input value={formData.medical_officer} onChange={handleInputChange("medical_officer")} />
              </div>

              <div>
                <Label>Contact Phone</Label>
                <Input value={formData.contact_phone} onChange={handleInputChange("contact_phone")} />
              </div>

              <div>
                <Label>Service</Label>
                <Input value={formData.service} onChange={handleInputChange("service")} />
              </div>

              <div>
                <Label>Ward</Label>
                <Input value={formData.ward} onChange={handleInputChange("ward")} />
              </div>
            </div>
          </section>

          {/* -------------------------------- FAMILY -------------------------------- */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Family Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div>
                <Label>Father Name</Label>
                <Input value={formData.father_name} onChange={handleInputChange("father_name")} />
              </div>

              <div>
                <Label>Admission Date</Label>
                <Input type="date" value={formData.admission_date} onChange={handleInputChange("admission_date")} />
              </div>

              <div>
                <Label>Admission Time</Label>
                <Input type="time" value={formData.admission_time} onChange={handleInputChange("admission_time")} />
              </div>

              <div>
                <Label>Mother Name</Label>
                <Input value={formData.mother_name} onChange={handleInputChange("mother_name")} />
              </div>

              <div>
                <Label>Discharge Date</Label>
                <Input type="date" value={formData.discharge_date} onChange={handleInputChange("discharge_date")} />
              </div>

              <div>
                <Label>Discharge Time</Label>
                <Input type="time" value={formData.discharge_time} onChange={handleInputChange("discharge_time")} />
              </div>
            </div>
          </section>

          {/* -------------------------------- MEDICAL DETAILS -------------------------------- */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Medical Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="col-span-full">
                <Label>Admitted For</Label>
                <Textarea rows={4} value={formData.admitted_for} onChange={handleTextareaChange("admitted_for")} />
              </div>

              <div className="col-span-full">
                <Label>Drug Allergy</Label>
                <Input value={formData.drug_allergy} onChange={handleInputChange("drug_allergy")} />
              </div>

              <div className="col-span-full">
                <Label>Remarks</Label>
                <Textarea rows={4} value={formData.remarks} onChange={handleTextareaChange("remarks")} />
              </div>

              <div className="col-span-full">
                <Label>Discharge Diagnosis</Label>
                <Input value={formData.discharge_diagnosis} onChange={handleInputChange("discharge_diagnosis")} />
              </div>

              <div className="col-span-full">
                <Label>Other Diagnosis</Label>
                <Input value={formData.other_diagnosis} onChange={handleInputChange("other_diagnosis")} />
              </div>

              <div className="col-span-full">
                <Label>External Cause of Injury</Label>
                <Input value={formData.external_cause_of_injury} onChange={handleInputChange("external_cause_of_injury")} />
              </div>

              <div className="col-span-full">
                <Label>Clinician Summary</Label>
                <Textarea rows={5} value={formData.clinician_summary} onChange={handleTextareaChange("clinician_summary")} />
              </div>

              <div className="col-span-full">
                <Label>Surgical Procedure</Label>
                <Textarea rows={4} value={formData.surgical_procedure} onChange={handleTextareaChange("surgical_procedure")} />
              </div>
            </div>
          </section>

          {/* -------------------------------- DISCHARGE INFO -------------------------------- */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Discharge Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <div>
                <Label>Type of Discharge</Label>
                <Input value={formData.discharge_type} onChange={handleInputChange("discharge_type")} />
              </div>

              <div>
                <Label>Discharge Status</Label>
                <Input value={formData.discharge_status} onChange={handleInputChange("discharge_status")} />
              </div>

              <div>
                <Label>Cause of Death</Label>
                <Input value={formData.cause_of_death} onChange={handleInputChange("cause_of_death")} />
              </div>

              <div>
                <Label>Autopsy</Label>
                <Select value={formData.autopsy} onValueChange={(v) => handleChange("autopsy", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Certify By</Label>
                <Input value={formData.certify_by} onChange={handleInputChange("certify_by")} />
              </div>

              <div>
                <Label>Approved By</Label>
                <Input value={formData.approved_by} onChange={handleInputChange("approved_by")} />
              </div>
            </div>
          </section>

          {/* -------------------------------- STAFF INFO -------------------------------- */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Medical Staff Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <div>
                <Label>Doctor</Label>
                <Select value={formData.doctor_id} onValueChange={(v) => handleChange("doctor_id", v)}>
                  <SelectTrigger><SelectValue placeholder="Select Doctor" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Dr. Smith</SelectItem>
                    <SelectItem value="2">Dr. Johnson</SelectItem>
                    <SelectItem value="3">Dr. Williams</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Nurse</Label>
                <Select value={formData.nurse_id} onValueChange={(v) => handleChange("nurse_id", v)}>
                  <SelectTrigger><SelectValue placeholder="Select Nurse" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Nurse Davis</SelectItem>
                    <SelectItem value="2">Nurse Miller</SelectItem>
                    <SelectItem value="3">Nurse Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Doctor Name</Label>
                <Input value={formData.doctor_name} onChange={handleInputChange("doctor_name")} />
              </div>

              <div>
                <Label>Doctor Signature</Label>
                <Input value={formData.doctor_signature} onChange={handleInputChange("doctor_signature")} />
              </div>
            </div>
          </section>

          <DialogFooter className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
            <Button type="submit" className="w-full sm:w-auto">Save Patient</Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
