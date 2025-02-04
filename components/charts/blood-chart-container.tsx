import { getVitalSignsData } from "@/utils/services/medical-records";
import React from "react";
import { BloodPressureChart } from "./blood-sugar-cgart";
import { HeartRateChart } from "./heart-rate-chart";

export const BloodChartContainer = async ({ id }: { id: string }) => {
  const { data, average, heartRateData, averageHeartRate } =
    await getVitalSignsData(id);

  return (
    <>
      {/* Blood Pressure chart */}
      <BloodPressureChart data={data} average={average} />

      {/* Heart Rate Card */}
      <HeartRateChart data={heartRateData!} average={averageHeartRate} />
    </>
  );
};
