import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import React from "react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex bg-gray-900 ">
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]">
        <Sidebar />
      </div>
      <main className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA]  flex flex-1 flex-col h-full">
        <Navbar />
        <div className="flex-1  p-2 overflow-auto">{children}</div>
      </main>
    </div>
  );
};

export default ProtectedLayout;
