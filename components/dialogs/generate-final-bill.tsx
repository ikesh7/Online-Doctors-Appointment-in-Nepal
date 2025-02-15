"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { generateBill } from "@/app/actions/medical";
import { PaymentSchema } from "@/lib/schema";
import { z } from "zod";
import { CustomInput } from "../custom-inputs";
import { Button } from "../ui/button";
import { CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";

interface DataProps {
  id?: string | number;
  total_bill: number;
  appointment_id: number; // Pass appointment_id as a prop
}

export const GenerateFinalBills = ({
  id,
  total_bill,
  appointment_id,
}: DataProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Set defaultValues, including appointment_id from the props
  const form = useForm<z.infer<typeof PaymentSchema>>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      id: id?.toString(),
      bill_date: new Date(),
      discount: "0", // Default discount value
      total_amount: total_bill.toString(), // Automatically filled based on the passed prop
      appointment_id: appointment_id, // Automatically filled from the prop
    },
  });

  const handleOnSubmit = async (values: z.infer<typeof PaymentSchema>) => {
    try {
      setIsLoading(true);

      // Convert appointment_id to a number before sending to the backend
      const appointmentId = Number(values.appointment_id);

      if (isNaN(appointmentId)) {
        toast.error("Please enter a valid Appointment ID.");
        setIsLoading(false);
        return;
      }

      const resp = await generateBill({
        ...values,
        appointment_id: appointmentId, // Ensure it's sent as a number
      });

      if (resp.success) {
        toast.success("Patient bill generated successfully!");
        router.refresh();
        form.reset();
      } else if (resp.error) {
        toast.error(resp.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-sm font-normal">
            <Plus size={22} className="text-gray-400" />
            Generate Final Bill
          </Button>
        </DialogTrigger>
        <DialogContent>
          <CardHeader className="px-0">
            <DialogTitle>Patient Medical Bill</DialogTitle>
          </CardHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center gap-2">
                <div className="">
                  <span>Total Bill</span>
                  <p className="text-3xl font-semibold">
                    {total_bill?.toFixed(2)}
                  </p>
                </div>
              </div>

              <CustomInput
                type="input"
                control={form.control}
                name="discount"
                placeholder="eg.: 5"
                label="Discount (%)"
              />

              <CustomInput
                type="input"
                control={form.control}
                name="bill_date"
                label="Bill Date"
                placeholder=""
                inputType="date"
              />

              {/* Display appointment_id instead of input field */}
              <div className="flex flex-col">
                <label className="font-medium text-sm">Appointment ID</label>
                <p className="text-lg font-semibold">{appointment_id}</p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 w-full"
              >
                Generate Bill
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
