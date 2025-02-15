// "use client";

// import { addNewDiagnosis } from "@/app/actions/medical";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import { Form } from "./ui/form";
// import { DiagnosisSchema } from "@/lib/schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { MedicalRecords, Patient } from "@prisma/client";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import * as z from "zod";
// import { useRouter } from "next/navigation";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./ui/dialog";

// export const DiagnosisForm = ({
//   patient,
//   medicalRecords,
// }: {
//   patient: Patient;
//   medicalRecords: MedicalRecords[];
// }) => {
//   const router = useRouter();

//   const form = useForm<z.infer<typeof DiagnosisSchema>>({
//     resolver: zodResolver(DiagnosisSchema),
//     defaultValues: {
//       patient_id: patient.id,
//       medical_id: "", // Set this dynamically if needed
//       doctor_id: "", // Set this dynamically if needed
//       symptoms: "",
//       diagnosis: "",
//       notes: "",
//       prescribed_medications: "",
//       follow_up_plan: "",
//     },
//   });

//   const onSubmit = (data: z.infer<typeof DiagnosisSchema>) => {
//     addNewDiagnosis(data)
//       .then((response) => {
//         toast.success(response.msg);
//         router.push("/somepath"); // Redirect after success
//       })
//       .catch((error) => {
//         toast.error(error.msg);
//       });
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">Open Diagnosis Form</Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add Diagnosis</DialogTitle>
//         </DialogHeader>
//         <Card>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)}>
//               {/* Your form fields go here */}
//               <Button type="submit">Submit Diagnosis</Button>
//             </form>
//           </Form>
//         </Card>
//       </DialogContent>
//     </Dialog>
//   );
// };
