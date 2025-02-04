import db from "@/lib/db";
import { processAppointments } from "./patient";
import { daysOfWeek } from "..";

export async function getAdminDashboardStatistics() {
  try {
    const getToday = () => {
      const today = new Date().getDay();
      return daysOfWeek[today];
    };

    const todayDay = getToday();

    const [totalPatient, totalDoctors, appointments, doctors] =
      await Promise.all([
        db.patient.count(),
        db.doctor.count(),
        db.appointment.findMany({
          include: {
            patient: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                img: true,
                gender: true,
                colorCode: true,
              },
            },
            doctor: {
              select: {
                id: true,
                name: true,
                specialization: true,
                img: true,
                colorCode: true,
              },
            },
          },
          orderBy: { appointment_date: "desc" },
        }),
        db.doctor.findMany({
          where: {
            working_days: { some: { day: todayDay } },
          },
          select: {
            id: true,
            name: true,
            specialization: true,
            img: true,
            working_days: true,
            colorCode: true,
          },
        }),
      ]);

    const { appointmentCounts, monthlyData } = await processAppointments(
      appointments
    );

    const last5Records = appointments?.slice(0, 5);
    const availableDoctors = doctors.slice(0, 5);

    return {
      totalPatient,
      appointmentCounts,
      last5Records,
      totalAppointments: appointments?.length,
      availableDoctors,
      totalDoctors,
      monthlyData,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}

export async function getServices() {
  try {
    const data = await db.services.findMany({
      orderBy: { name: "asc" },
    });

    if (!data) {
      return {
        success: false,
        message: "Data not found",
        status: 404,
        data: [],
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
