import { LabDashboardContainer } from "@/components/labtest/lab-dashbaord";
import { ServicesSettings } from "@/components/labtest/services-setting";
import { AllLabRecords } from "@/components/labtest/test-records";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, LayoutDashboard, List } from "lucide-react";

const LabDashboard = async (props: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // const searchParams = await props.searchParams;

  return (
    <div className="container mx-auto py-0">
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="all-records" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            All Records
          </TabsTrigger>
          {/* <TabsTrigger value="add-result" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Lab Result
          </TabsTrigger> */}
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Service
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <LabDashboardContainer />
        </TabsContent>
        <TabsContent value="all-records">
          <AllLabRecords {...props} />
        </TabsContent>
        {/* <TabsContent value="add-result">
          <LabResultForm />
        </TabsContent> */}

        <TabsContent value="services" className="space-y-4">
          <ServicesSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LabDashboard;
