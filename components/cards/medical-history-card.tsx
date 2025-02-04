import { Diagnosis, MedicalRecords } from "@prisma/client";
import { Card, CardContent } from "../ui/card";
import { SelectSeparator } from "../ui/select";

interface Doctor {
  id: string | number;
  name: string;
  specialization: string;
}

interface ExtendedDiagnosis extends Diagnosis {
  doctor: Doctor;
}

interface MedicalPros {
  el: ExtendedDiagnosis;
  index: number;
}
export const MedicalHistoryCard = ({ index, el }: MedicalPros) => {
  return (
    <Card key={index} className="rounded-xl shadow-none">
      <CardContent className="space-y-8 pt-4">
        <div className="space-y-6">
          <div className="flex gap-x-6 justify-between">
            <div>
              <span className="text-sm text-gray-500">Appointment ID</span>

              <p className="text-3xl font-semibold"># {el?.id}</p>
            </div>
            {index === 0 && (
              <div className="px-4 h-6 text-center bg-blue-100 rounded-full font-semibold text-blue-600">
                <span> Recent</span>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-500">Date</span>
              <p className="text-lg font-medium">
                {new Date(el.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <SelectSeparator />
          <div>
            <span className="text-sm text-gray-500">Diagnosis</span>
            <p className="text-lg font-medium">{el?.diagnosis}</p>
          </div>
          <SelectSeparator />
          <div>
            <span className="text-sm text-gray-500">Symptoms</span>
            <p className="text-lg font-medium">{el?.symptoms}</p>
          </div>

          <SelectSeparator />
          <div>
            <span className="text-sm text-gray-500">Additional Note</span>
            <p className="text-lg font-medium">{el?.notes}</p>
          </div>

          <div>
            <span className="text-sm text-gray-500">Doctor</span>
            <div>
              <p className="text-lg font-medium">{el?.doctor?.name}</p>
              <span className="text-sm text-blue-500 capitalize">
                {el?.doctor?.specialization}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
