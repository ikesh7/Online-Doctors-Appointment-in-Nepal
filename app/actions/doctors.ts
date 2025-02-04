"use server";

import db from "@/lib/db";
import { DoctorSchema, WorkingDaysSchema } from "@/lib/schema";
import { generateRandomColor } from "@/utils";
import { clerkClient } from "@clerk/nextjs/server";

export const createDoctor = async (data: any) => {
  try {
    const values = DoctorSchema.safeParse(data);
    const workdaysValues = WorkingDaysSchema.safeParse(data.work_schedule);

    if (!values.success || !workdaysValues.success) {
      return { success: false, error: true, msg: "Provide all fields." };
    }
   
    

    const validatedData = values.data;
    const workDaysValidatedData = workdaysValues.data!;


    const client = await clerkClient();
    if (!validatedData.email) {
      throw new Error("Email required.");
    }
    console.log("Email being sent to Clerk:", validatedData.email); // Debug log


    const user = await client.users.createUser({
      emailAddress: [validatedData.email],
      password: validatedData.password,
      firstName: validatedData.name.split(" ")[0],
      lastName: validatedData.name.split(" ")[1],
      publicMetadata: { role: "doctor" },
    });
    delete validatedData["password"];


    const doctor = await db.doctor.create({
      data: {
        ...validatedData,
        colorCode: generateRandomColor(),
        id: user.id,
      },
    });

    console.log("Doctor saved to database:", doctor);

  if (!doctor.id) {
    throw new Error("Doctor ID is undefined.");
  }

    await Promise.all(
      workDaysValidatedData.map((el) =>
        db.workingDays.create({
          data: { ...el, doctor_id: doctor.id },
        })
      )
    );

    await db.notification.create({
      data: {
        title: "Welcome on board",
        message: `You are welcome to the Healthcare Management System Dr ${validatedData.name}.`,
        user_id: user.id,
      },
    });

    return { success: true, error: false, msg: "Doctor added successfully." };
  } catch (error: any) {
    console.log(error);
    return { success: false, error: true, msg: error?.message };
  }
};

async function rateDoctor(
  doctorId: string,
  patientId: string,
  rating: number,
  comment?: string
) {
  try {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5.");
    }

    const newRating = await db.rating.create({
      data: {
        staff_id: doctorId,
        patient_id: patientId,
        rating,
        comment,
      },
    });

    return { success: true, msg: "Rating created successfully" };
  } catch (error: any) {
    console.log(error);
    return { success: false, error: true, msg: error?.message };
  }
}
