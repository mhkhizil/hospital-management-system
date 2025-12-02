import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import { 
  User, 
  Phone, 
  Users, 
  FileText,
  Heart,
   UserCheck,
  
} from "lucide-react";

interface PatientViewModalProps {
  open: boolean;
  onClose: () => void;
  patient: any;
}

export default function PatientViewModal({ open, onClose, patient }: PatientViewModalProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-blue-600" />
            Patient Complete Record
          </DialogTitle>
          <DialogDescription>
            Viewing detailed information for {patient.name || "Patient"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="font-semibold">{patient.name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Sex</p>
                <p className="font-semibold">{patient.sex || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p className="font-semibold">{patient.age || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p className="font-semibold">{patient.dob || "N/A"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                <p className="text-sm font-medium text-gray-500">Permanent Address</p>
                <p className="font-semibold whitespace-pre-wrap">{patient.permanent_address || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Marital Status</p>
                <p className="font-semibold">{patient.marital_status || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Ethnic Group</p>
                <p className="font-semibold">{patient.ethnic_group || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Religion</p>
                <p className="font-semibold">{patient.religion || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Occupation</p>
                <p className="font-semibold">{patient.occupation || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Previous Admission Date</p>
                <p className="font-semibold">{patient.prev_admission_date || "N/A"}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Contact & Relative Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact & Relative Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="space-y-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                <p className="text-sm font-medium text-gray-500">Nearest Relative / Friend Name</p>
                <p className="font-semibold">{patient.nearest_relative_name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Relationship</p>
                <p className="font-semibold">{patient.relationship || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Referred By</p>
                <p className="font-semibold">{patient.referred_by || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Police Case</p>
                <Badge variant={patient.police_case === "yes" ? "destructive" : "secondary"}>
                  {patient.police_case || "N/A"}
                </Badge>
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                <p className="text-sm font-medium text-gray-500">Present Address</p>
                <p className="font-semibold whitespace-pre-wrap">{patient.present_address || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Medical Officer</p>
                <p className="font-semibold">{patient.medical_officer || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Contact Phone</p>
                <p className="font-semibold">{patient.contact_phone || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Service</p>
                <p className="font-semibold">{patient.service || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Ward</p>
                <p className="font-semibold">{patient.ward || "N/A"}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Family Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Family Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Father Name</p>
                <p className="font-semibold">{patient.father_name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Admission Date</p>
                <p className="font-semibold">{patient.admission_date || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Admission Time</p>
                <p className="font-semibold">{patient.admission_time || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Mother Name</p>
                <p className="font-semibold">{patient.mother_name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Discharge Date</p>
                <p className="font-semibold">{patient.discharge_date || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Discharge Time</p>
                <p className="font-semibold">{patient.discharge_time || "N/A"}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Medical Details */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Medical Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-medium text-gray-500">Admitted For</p>
                <p className="font-semibold whitespace-pre-wrap">{patient.admitted_for || "N/A"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-medium text-gray-500">Drug Allergy</p>
                <p className="font-semibold">{patient.drug_allergy || "N/A"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-medium text-gray-500">Remarks</p>
                <p className="font-semibold whitespace-pre-wrap">{patient.remarks || "N/A"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-medium text-gray-500">Discharge Diagnosis</p>
                <p className="font-semibold">{patient.discharge_diagnosis || "N/A"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-medium text-gray-500">Other Diagnosis</p>
                <p className="font-semibold">{patient.other_diagnosis || "N/A"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-medium text-gray-500">External Cause of Injury</p>
                <p className="font-semibold">{patient.external_cause_of_injury || "N/A"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-medium text-gray-500">Clinician Summary</p>
                <p className="font-semibold whitespace-pre-wrap">{patient.clinician_summary || "N/A"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-medium text-gray-500">Surgical Procedure</p>
                <p className="font-semibold whitespace-pre-wrap">{patient.surgical_procedure || "N/A"}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Discharge Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Discharge Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Type of Discharge</p>
                <p className="font-semibold">{patient.discharge_type || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Discharge Status</p>
                <p className="font-semibold">{patient.discharge_status || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Cause of Death</p>
                <p className="font-semibold">{patient.cause_of_death || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Autopsy</p>
                <Badge variant={patient.autopsy === "yes" ? "destructive" : "secondary"}>
                  {patient.autopsy || "N/A"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Certify By</p>
                <p className="font-semibold">{patient.certify_by || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Approved By</p>
                <p className="font-semibold">{patient.approved_by || "N/A"}</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Medical Staff Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Medical Staff Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Doctor</p>
                <p className="font-semibold">
                  {patient.doctor_id === "1" ? "Dr. Smith" : 
                   patient.doctor_id === "2" ? "Dr. Johnson" : 
                   patient.doctor_id === "3" ? "Dr. Williams" : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Nurse</p>
                <p className="font-semibold">
                  {patient.nurse_id === "1" ? "Nurse Davis" : 
                   patient.nurse_id === "2" ? "Nurse Miller" : 
                   patient.nurse_id === "3" ? "Nurse Wilson" : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Doctor Name</p>
                <p className="font-semibold">{patient.doctor_name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Doctor Signature</p>
                <p className="font-semibold">{patient.doctor_signature || "N/A"}</p>
              </div>
            </div>
          </section>
        </div>
        
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => window.print()}
            className="print:hidden"
          >
            Print Record
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}