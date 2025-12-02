import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define Patient type (you can adjust based on your DB)
export interface Patient {
  id?: string;
  name: string;
  age: number | string;
  phone: string;
  address: string;
}

// Props type for the modal
interface EditPatientModalProps {
  open: boolean;
  onClose: () => void;
  patient: Patient | null;
  onUpdate?: (data: Patient) => void;
}

export default function PatientEditModal({
  open,
  onClose,
  patient,
  onUpdate,
}: EditPatientModalProps) {
  const [formData, setFormData] = useState<Patient>({
    name: "",
    age: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        age: patient.age,
        phone: patient.phone,
        address: patient.address,
      });
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (onUpdate) onUpdate(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4 rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Patient Name"
          />

          <Input
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
          />

          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />

          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
