"use client";

import { updatedPatientMetadata } from "@/actions/patient";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "./ui/button";

export const ViewDashboard = () => {
  const { user } = useUser();

  const handleUpdate = async () => {
    const role = user?.publicMetadata?.role;

    if (!role) {
      console.log("called");
      await updatedPatientMetadata(user?.id!);
    }
  };

  // useEffect(() => {
  //   user?.id && handleUpdate();
  // }, [user]);

  return (
    <Button asChild onClick={() => handleUpdate()}>
      <Link href={"/patient"}>View Dashboard</Link>
    </Button>
  );
};
