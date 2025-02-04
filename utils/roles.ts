import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";
import { USER_ROLES } from ".";

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();

  // Check if sessionClaims and metadata exist, and provide a fallback if necessary
  const user_role = (
    sessionClaims?.metadata?.role || USER_ROLES.PATIENT
  ).toUpperCase();

  return user_role === role;
};

export const getRole = async () => {
  const { sessionClaims } = await auth();

  // Ensure sessionClaims and metadata exist before accessing role
  const userRole = sessionClaims?.metadata?.role || USER_ROLES.PATIENT;

  // Convert the role to lowercase for consistency
  const role = userRole.toLowerCase();

  return role;
};
