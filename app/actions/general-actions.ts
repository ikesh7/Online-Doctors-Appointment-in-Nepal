"use server";

import db from "@/lib/db";
import { DeleteType } from "@/types";
import { getRole } from "@/utils/roles";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";

export async function deleteDataById(id: string, type: DeleteType) {
  try {
    // Step 1: Handle deletion from the database
    switch (type) {
      case "doctor":
        await db.doctor.delete({ where: { id } });
        break;
      case "staff":
        await db.staff.delete({ where: { id } });
        break;
      case "patient":
        await db.patient.delete({ where: { id } });
        break;
      case "auditLog":
        await db.auditLog.delete({ where: { id: Number(id) } });
        break;
      case "bill":
        await db.patientBills.delete({ where: { id: Number(id) } });
        break;
      case "payment":
        await db.payment.delete({ where: { id: Number(id) } });
        break;
      case "service":
        await db.services.delete({ where: { id: Number(id) } });
        break;
      default:
        break;
    }

    // Step 2: Handle deletion from Clerk (if applicable)
    if (type === "patient" || type === "staff" || type === "doctor") {
      // Validate the id before proceeding with Clerk API call
      if (!id || typeof id !== 'string') {
        console.error("Invalid user ID provided for deletion:", id);
        return { success: false, message: "Invalid user ID provided" };
      }

      try {
        const client = await clerkClient();
        console.log(`Attempting to delete ${type} with id: ${id}`); // Log the id before deletion

        await client.users.deleteUser(id); // id should be the userId from Clerk
        console.log(`${type} deleted from Clerk with id: ${id}`); // Successful deletion log
      } catch (error: any) {
        // Log detailed error from Clerk API
        if (error?.message) {
          console.error(`Error deleting ${type} with id: ${id}:`, error.message);
        } else {
          console.error(`Unknown error deleting ${type} with id: ${id}:`, error);
        }
        return { success: false, message: "Error deleting from Clerk" };
      }
    }

    // Final success message after all deletions
    return { success: true, message: "Data deleted successfully" };
  } catch (error) {
    // Log the general error
    console.error("Error during data deletion:", error);
    return { success: false, message: "Internal Server Error" };
  }
}



export const addReview = async (data: any) => {
  try {
    await db.rating.create({
      data: {
        ...data,
      },
    });

    return { success: true, error: false, msg: "Review added successfully." };
  } catch (error: any) {
    console.log(error);
    return { success: false, error: true, msg: error?.message };
  }
};

export const markRead = async (userId: string, id?: number) => {
  try {
    if (id) {
      await db.notification.update({
        where: { id: Number(id) },
        data: { isRead: true },
      });
    } else {
      await db.notification.updateMany({
        where: { user_id: userId },
        data: { isRead: true },
      });
    }

    return { success: true, error: false, msg: "Mark read successfully." };
  } catch (error: any) {
    console.log(error);
    return { success: false, error: true, msg: error?.message };
  }
};

export const checkAndAddNewUser = async () => {
  try {
    const user = await currentUser();

    const userExist = await db.user.findUnique({
      where: { id: user?.id },
    });

    if (userExist) {
      // console.log("user exist");
      return null;
      // return { success: true, error: false, msg: "User already exists." };
    } else {
      const role = await getRole();

      await db.user.create({
        data: {
          id: user?.id!,
          email: user?.emailAddresses[0].emailAddress!,
          name: user?.firstName + " " + user?.lastName,
          role: role.toUpperCase() as Role,
        },
      });
      // console.log("user created");
      return null;
      // return { success: true, error: false, msg: "User created successfully." };
    }
  } catch (error: any) {
    console.log(error);
    return { success: false, error: true, msg: error?.message };
  }
};
