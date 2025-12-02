import * as React from "react";
import { usePatientManagement } from "@/core/presentation/hooks/usePatientManagement";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import { useState } from "react";
import PatientEditModal from "@/components/patients/PatientEditModal";//added new page
import PatientAddModal from "@/components/patients/PatientAddModal";//added new

export default function PatientsPage() {
  const { patients, loading, searchPatients } = usePatientManagement();
  const [query, setQuery] = React.useState("");

  // Temporary add patient function
  const addPatient = (patientData: any) => {
    // TODO: Replace with actual API call
    console.log("Adding patient:", patientData);
    // For now, just log the data
  };

  // Temporary update patient function
  const updatePatient = (updatedPatient: any) => {
    // TODO: Replace with actual API call
    console.log("Updating patient:", updatedPatient);
    // For now, just log the data
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    searchPatients(value);
  };

  const handleDelete = (patientId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete patient:", patientId);
  };

  const handleView = (patientId: string) => {
    // TODO: Implement view functionality
    console.log("View patient:", patientId);
  };

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit Button Function
  const handleEdit = (patient: any) => {
    setSelectedPatient(patient);
    setIsEditModalOpen(true);
  };

  // Add Button Function
  const handleRegisterNewPatient = () => {
    setIsAddModalOpen(true);
  };

  // Handle adding a new patient
  const handleAddPatient = (patientData: any) => {
    addPatient(patientData);
    setIsAddModalOpen(false);
  };

  // Handle updating a patient
  const handleUpdatePatient = (updatedPatient: any) => {
    updatePatient(updatedPatient);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Care delivery
        </p>
        <h2 className="mt-2 text-3xl font-semibold">Active Patients</h2>
      </div>

      <Card className="bg-card/70">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle>Patient Registry</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Input
              value={query}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search by name, department, or doctor"
              className="w-full sm:w-80"
            />
            <Button 
              onClick={handleRegisterNewPatient}
              className="whitespace-nowrap"
            >
              <Plus className="mr-2 h-4 w-4" />
              Register New Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Physician</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Last Visit</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {patients.map((patient) => (
                <tr key={patient.id} className="text-sm">
                  <td className="py-3 font-semibold">{patient.fullName}</td>
                  <td className="py-3 text-muted-foreground">
                    {patient.department}
                  </td>
                  <td className="py-3">{patient.attendingPhysician}</td>
                  <td className="py-3">
                    <Badge
                      variant={
                        patient.status === "admitted"
                          ? "default"
                          : patient.status === "outpatient"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-xs text-muted-foreground">
                    {new Date(patient.lastVisit).toLocaleString()}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      {/* View Button - Silver */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        onClick={() => handleView(patient.id)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View patient</span>
                      </Button>
                      
                      {/* Edit Button - Violet */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                        onClick={() => handleEdit(patient)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Update patient</span>
                      </Button>
                      
                      {/* Delete Button - Red */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDelete(patient.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete patient</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Patient Edit Modal */}
          <PatientEditModal
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            patient={selectedPatient}
            onUpdate={handleUpdatePatient}
          />

          {/* Patient Add Modal */}
          <PatientAddModal
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddPatient}
          />

          {loading && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Loading patient data...
            </p>
          )}
          {!loading && patients.length === 0 && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              No patients match your query.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


