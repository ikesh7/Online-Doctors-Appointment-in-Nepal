"use server";

import db from "@/lib/db";
import { StaffSchema } from "@/lib/schema";
import { clerkClient } from "@clerk/nextjs/server";

export const createStaff = async (data: any) => {
  try {
    const values = StaffSchema.safeParse(data);

    if (!values.success) {
      return { success: false, error: true, msg: "Provide all fields." };
    }

    const validatedData = values?.data;
    delete validatedData["password"];

    const client = await clerkClient();

    const user = await client.users.createUser({
      emailAddress: [validatedData.email],
      password: validatedData.phone,
      firstName: validatedData.name.split(" ")[0],
      lastName: validatedData.name.split(" ")[1],
      publicMetadata: { role: data?.role === "NURSE" ? "nurse" : "lab" },
    });

    const doctor = await db.staff.create({
      data: {
        ...validatedData,
        id: user.id,
      },
    });

    await db.notification.create({
      data: {
        title: "Welcome on board",
        message: `You are welcome to the Healthcare Management System ${validatedData.name}.`,
        user_id: user.id,
      },
    });

    return { success: true, error: false, msg: "Doctor added successfully." };
  } catch (error: any) {
    console.log(error);
    return { success: false, error: true, msg: error?.message };
  }
};
