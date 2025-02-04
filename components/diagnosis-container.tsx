import db from "@/lib/db";
import { Diagnosis, MedicalRecords } from "@prisma/client";
import { AddDiagnosis } from "./dialogs/add-diagnosis";
import { NoDataFound } from "./no-data-found";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { SelectSeparator } from "./ui/select";
import { MedicalHistoryCard } from "./cards/medical-history-card";
import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";

interface DataProps {
  id: string | number;
  patientId: string;
  medicalId?: string;
  doctor_id: string | number;
}

interface Doctor {
  id: string | number;
  name: string;
  specialization: string;
}

interface ExtendedDiagnosis extends Diagnosis {
  doctor: Doctor;
}

interface MedicalPros extends MedicalRecords {
  diagnosis: ExtendedDiagnosis[];
}

export const DiagnosisContainer = async ({
  id,
  patientId,
  doctor_id,
}: DataProps) => {
  const { userId } = auth();
  const data: MedicalPros | null = await db.medicalRecords.findFirst({
    where: {
      appointment_id: Number(id),
    },
    include: {
      diagnosis: {
        include: {
          doctor: true,
        },
        orderBy: { created_at: "desc" },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const diagnosis = data?.diagnosis ? data?.diagnosis : null;

  return (
    <div className="">
      {diagnosis?.length === 0 || !diagnosis ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <NoDataFound note="No Diagnosis found for this appointment" />
          {(!checkRole("PATIENT") || doctor_id === userId) && (
            <AddDiagnosis
              key={new Date().getTime()}
              patientId={patientId}
              doctor_id={doctor_id}
              appointment_id={id}
              medicalId={data ? data?.id.toString() : ""}
            />
          )}
        </div>
      ) : (
        <section className="space-y-6">
          <Card className="rounded-xl shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-600">
                    Medical Record
                  </CardTitle>
                  <CardDescription>
                    There are <strong>{diagnosis?.length}</strong> medical
                    record(s) associated with this appointment
                  </CardDescription>
                </div>

                {(!checkRole("PATIENT") || doctor_id === userId) && (
                  <AddDiagnosis
                    key={new Date().getTime()}
                    patientId={patientId}
                    doctor_id={doctor_id}
                    appointment_id={id}
                    medicalId={data ? data?.id.toString() : ""}
                  />
                )}
              </div>
            </CardHeader>
          </Card>
          {diagnosis?.map((el, id) => (
            <div key={id}>
              <MedicalHistoryCard el={el} index={id} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
