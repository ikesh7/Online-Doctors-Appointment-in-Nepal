"use server";

import db from "@/lib/db";

import {
  DiagnosisSchema,
  LabRequestSchema,
  LabResultSchema,
  PatientBillSchema,
  PaymentSchema,
} from "@/lib/schema";
import { LabTest } from "@prisma/client";
import { checkRole, getRole } from "@/utils/roles";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export async function addNewDiagnosis(data: any) {
  try {
    const isValidData = DiagnosisSchema.safeParse(data);

    const validatedData = isValidData.data;
    let medicalRecords = null;

    if (!validatedData?.medical_id) {
      medicalRecords = await db.medicalRecords.create({
        data: {
          patient_id: validatedData?.patient_id!,
          doctor_id: data?.doctor_id!,
          appointment_id: data?.appointment_id,
        },
      });
    }

    const med_id = validatedData?.medical_id || medicalRecords?.id;

    const res = await db.diagnosis.create({
      data: {
        ...validatedData!,
        medical_id: Number(med_id!),
      },
    });

    return {
      success: true,
      error: false,
      msg: `Diagnosis added successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}
export const generateBill = async (paymentData: z.infer<typeof PaymentSchema>) => {
  console.log("Generating bill with the following data:", paymentData);
  // Validation for input data using Zod schema
  const validationResult = PaymentSchema.safeParse(paymentData);
  if (!validationResult.success) {
    return { success: false, error: true, msg: "Validation failed", details: validationResult.error.errors };
  }

  const { id, bill_date, discount, total_amount, appointment_id } = paymentData;

  // If discount is provided, convert it to a number; else, set it to 0
  const discountPercentage = discount ? parseFloat(discount) : 0;

  // Ensure that the discount is within valid range
  if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
    return { success: false, error: true, msg: "Invalid discount percentage" };
  }

  // Calculate final amount after discount
  const finalAmount = parseFloat(total_amount) * (1 - discountPercentage / 100);  // Apply discount

  try {
    // Assuming you have the patient_id passed in the paymentData or you need to get it from elsewhere
    const patient_id = "patient-id-placeholder";  // Replace this with actual logic to get the patient_id

    // Create a new payment record
    const payment = await db.payment.create({
      data: {
        bill_date: new Date(bill_date), // Ensure the bill date is in correct format
        payment_date: new Date(), // Set payment date to current time
        discount: discountPercentage, // Use the calculated discount
        total_amount: parseFloat(total_amount), // Ensure total_amount is a number
        amount_paid: finalAmount, // Store the amount paid (final amount)
        appointment_id: Number(appointment_id), // Ensure appointment_id is a number
        patient_id: patient_id, // Replace with actual patient ID
        payment_method: 'CASH', // Default payment method (can be modified)
        status: 'UNPAID', // Default payment status (can be modified)
      },
    });
    

    return {
      success: true,
      data: payment,
      message: "Bill generated successfully!",
    };
  } catch (error) {
    console.error("Error generating bill:", error);
    return {
      success: false,
      error: true,
      msg: "Error generating the bill. Please try again.",
    };
  }
};

export async function addNewBill(data: any) {
  try {
    const isValidData = PatientBillSchema.safeParse(data);
    const validatedData = isValidData.data;
    let bill_info = null;

    if (!data?.bill_id || data?.bill_id === "undefined") {
      const info = await db.appointment.findUnique({
        where: { id: Number(data?.appointment_id)! },
        select: {
          id: true,
          patient_id: true,
          bills: {
            where: {
              appointment_id: Number(data?.appointment_id),
            },
          },
        },
      });

      if (!info?.bills?.length) {
        bill_info = await db.payment.create({
          data: {
            appointment_id: Number(data?.appointment_id),
            patient_id: info?.patient_id!,
            bill_date: new Date(),
            payment_date: new Date(),
            discount: 0.0,
            amount_paid: 0.0,
            total_amount: 0.0,
          },
        });
      } else {
        bill_info = info?.bills[0];
      }
    } else {
      bill_info = {
        id: data?.bill_id,
      };
    }

    await db.patientBills.create({
      data: {
        bill_id: Number(bill_info?.id),
        service_id: Number(validatedData?.service_id),
        service_date: new Date(validatedData?.service_date!),
        quantity: Number(validatedData?.quantity),
        unit_cost: Number(validatedData?.unit_cost),
        total_cost: Number(validatedData?.total_cost),
      },
    });

    return {
      success: true,
      error: false,
      msg: `Bill added successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function getUserRole() {
  try {
    return await getRole();
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

 

export async function addLabRequest(data: any) {
  try {
    const isValidData = LabRequestSchema.safeParse(data);
    const validatedData = isValidData.data;
    let medicalRecords = null;

    if (!data?.recordId) {
      medicalRecords = await db.medicalRecords.create({
        data: {
          patient_id: data?.patientId,
          doctor_id: data?.doctorId!,
          appointment_id: data?.appointmentId,
        },
      });
    }

    const med_id = data?.recordId || medicalRecords?.id;

    let labData = [];
let testTypes = validatedData?.testTypes;

if (typeof testTypes === "string") {
  testTypes = [testTypes]; // Convert string to array
}

if (Array.isArray(testTypes)) {
  labData = testTypes.map((el) => {
    const service_id = getServiceIdFromTestType(el);

    // Ensure service_id and other fields are valid
    if (!service_id) {
      throw new Error(`Invalid test type: ${el}`);
    }

    const recordId = Number(med_id!);  // Ensure record_id is a valid number
    if (!recordId) {
      throw new Error("Invalid record_id.");
    }

    return {
      service_id: service_id,
      record_id: recordId,
      patient_id: data?.patientId,  // Ensure patient_id is a valid string
    };
  });
} else {
  throw new Error("testTypes should be an array or a string.");
}

// Debugging: Check data before sending to DB
console.log("Lab Data before DB:", labData);

// Ensure labData is not empty
if (labData.length === 0 || labData.some(item => !item.service_id || !item.record_id || !item.patient_id)) {
  throw new Error("Lab data is missing required fields.");
}

// Attempt to insert data into the database
const createResult = await db.labTest.createMany({ data: labData });
console.log("Lab data inserted:", createResult);

    return {
      success: true,
      error: false,
      msg: `Request successful`,
    };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, msg: "Internal Server Error" };
  }
}

// Helper function to get service_id from test type
function getServiceIdFromTestType(testType: string) {
  const testTypeToServiceIdMap: { [key: string]: number } = {
    "blood test": 1,
    "x-ray": 2,
    "MRI": 3,         // Ensure MRI is mapped correctly
    "CT scan": 4,
    "ultrasound": 5,
    "ECG": 6,
    "other": 7,
  };

  // Convert testType to lowercase for case-insensitive matching
  return testTypeToServiceIdMap[testType.toLowerCase()] || null; 

}
// Function to update the lab test result
export async function updateLabResult(data: any) {
  try {
    // Validate incoming data using LabResultSchema
    const isValidData = LabResultSchema.safeParse(data);

    if (!isValidData.success) {
      throw new Error("Invalid data: " + JSON.stringify(isValidData.error.errors));
    }

    const validatedData = isValidData.data;

    // Ensure testId exists and is valid
    const testId = validatedData.testId;
    const labTest = await db.labTest.findUnique({
      where: { id: testId },
    });

    if (!labTest) {
      throw new Error("Lab test not found.");
    }

    // Check if the current status is PENDING and can be updated
    if (labTest.status !== "PENDING") {
      throw new Error("Only PENDING tests can be updated.");
    }

    // Update the lab test with the new result and status
    const updatedLabTest = await db.labTest.update({
      where: { id: testId },
      data: {
        result: validatedData.result,
        test_date: new Date(validatedData.testDate), // Assuming testDate is in a valid string format
        status: validatedData.status,
        notes: validatedData.notes,
      },
    });

    return {
      success: true,
      msg: "Lab result updated successfully.",
      data: updatedLabTest,
    };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, msg: "Internal Server Error", error: error.message };
  }
}
