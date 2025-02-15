"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { calculateAge, formatPhoneNumber } from "@/utils";
import { Patient } from "@prisma/client";
import { Calendar, Clipboard, Home, Info, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import VideoCall from "@/components/VideoCall";

export function PatientDetailCard({ data }: { data: any }) {
  const [showVideoCall, setShowVideoCall] = useState(false);

  return (
    <Card className="p-4 bg-white shadow-none rounded-xl">
      <CardHeader className="flex items-start gap-4">
        <div className="relative w-20 h-20 xl:w-24 xl:h-24 rounded-full overflow-hidden">
          <Image
            src={data?.img || "/user.jpg"}
            alt="Patient"
            fill
            objectFit="cover"
          />
        </div>
        <div>
          <h2 className="text-lg xl:text-2xl font-bold">
            {data?.first_name} {data?.last_name}
          </h2>
          <p className="text-sm text-gray-500">
            {data?.gender} - {calculateAge(data?.date_of_birth)}
          </p>
          <p className="text-xs text-gray-400">Patient ID: {data?.id}</p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            className="flex justify-center bg-blue-100 text-blue-600 gap-x-3 px-4"
            onClick={() =>
              window.open("/video-call", "_blank", "width=800,height=600")
            }
            //onClick={() => setShowVideoCall(true)}
          >
            <Phone size={18} />
            Call
          </Button>

          {showVideoCall && <VideoCall />}
          <Button
            size="sm"
            variant="outline"
            className="flex justify-center bg-blue-100 text-blue-600 gap-x-3 px-4"
          >
            <Mail size={18} />
            Email
          </Button>
        </div>
      </CardHeader>
      <CardContent className="mt-4 space-y-4">
        <div className="flex items-start gap-3">
          <Calendar size={22} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Date of Birth</p>
            <p className="text-md font-medium">
              {data?.date_of_birth?.getDay()} /{" "}
              {data?.date_of_birth?.getMonth() + 1} /{" "}
              {data?.date_of_birth?.getFullYear()}{" "}
              <span className="font-light text-xs text-gray-600">
                (dd/mm/yyy)
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Home size={22} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Address</p>
            <p className="text-md font-medium">{data?.address}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail size={22} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-md font-medium">{data?.email}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone size={22} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Mobile</p>
            <p className="text-md font-medium">
              {formatPhoneNumber(data?.phone)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clipboard size={22} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Next Visit</p>
            <p className="text-md font-medium">
              17 May Monday, 10:15 AM{" "}
              <span className="text-xs text-blue-600">(Standard)</span>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Info size={22} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Primary Physician</p>
            <p className="text-md font-medium">Dr. Steven Louis, MBBS</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm text-gray-400">Active Conditions</p>
            <p className="text-md font-medium">
              {data?.medical_conditions || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Allergies</p>
            <p className="text-md font-medium">{data?.allergies || "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
