import Link from "next/link";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import ReviewForm from "./dialogs/rating-review-form";
import { checkRole } from "@/utils/roles";

export const AppointmentQuickLinks = ({ staffId }: { staffId?: string }) => {
  return (
    <Card className="w-full rounded-xl bg-white shadow-none">
      <CardHeader>
        <CardTitle className="text-lg text-gray-500">Quick Links</CardTitle>
      </CardHeader>

      <CardContent className="text-sm font-normal flex flex-wrap gap-4">
        <Link
          href="?cat=charts"
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600"
        >
          Charts
        </Link>
        <Link
          href="?cat=appointment"
          className="px-4 py-2 rounded-lg bg-violet-100 text-violet-600"
        >
          Appointment
        </Link>

        <Link
          href="?cat=medical-history"
          className="px-4 py-2 rounded-lg bg-rose-100 text-rose-600"
        >
          Medical History
        </Link>
        <Link
          href="?cat=lab-test"
          className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-600"
        >
          Lab Tests
        </Link>
        {/* <Link
          href="?cat=diagnosis"
          className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600"
        >
          Diagnosis
        </Link> */}

        <Link
          href="?cat=appointment#vital-signs"
          className="px-4 py-2 rounded-lg bg-green-100 text-green-600"
        >
          Vital Signs
        </Link>
        <Link
          href="?cat=bills"
          className="px-4 py-2 rounded-lg bg-sky-100 text-sky-600"
        >
          Medical Bills
        </Link>
        <Link
          href="?cat=payments"
          className="px-4 py-2 rounded-lg bg-pink-100 text-pink-600"
        >
          Payments
        </Link>

        {checkRole("PATIENT") && <ReviewForm staffId={staffId!} />}
      </CardContent>
    </Card>
  );
};
