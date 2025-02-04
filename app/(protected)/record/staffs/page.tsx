import { ListFilter, Users } from "lucide-react";

import ActionDialog from "@/components/dialogs/action-dialog";
import { StaffForm } from "@/components/forms/staff-form";
import { Pagination } from "@/components/pagination";
import { ProfileImage } from "@/components/profile-image";
import SearchInput from "@/components/search-input";
import { Table } from "@/components/tables/table";
import { Button } from "@/components/ui/button";
import { SearchParamsProps } from "@/types";
import { formatDate } from "@/utils";
import { checkRole } from "@/utils/roles";
import { getAllStaffs } from "@/utils/services/staffs";
import { DATA_LIMIT } from "@/utils/settings";
import { Staff } from "@prisma/client";

const columns = [
  {
    header: "Info",
    key: "name",
  },
  {
    header: "Role",
    key: "role",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    key: "contact",
    className: "hidden md:table-cell",
  },
  {
    header: "Email",
    key: "email",
    className: "hidden lg:table-cell",
  },
  {
    header: "Joined Date",
    key: "created_at",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    key: "action",
  },
];
const ManageStaffs = async (props: SearchParamsProps) => {
  const searchParams = await props.searchParams;
  const page = (searchParams?.p || "1") as string;
  const searchQuery = (searchParams?.q || "") as string;

  const { data, totalRecord, totalPages, currentPage } = await getAllStaffs({
    page,
    limit: DATA_LIMIT,
    search: searchQuery,
  });

  if (!data) {
    return null;
  }
  const renderRow = (item: Staff) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <ProfileImage url={item?.img!} name={item.name} />

        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <span className="text-sm capitalize">
            {item.role.toLocaleLowerCase()}
          </span>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.role}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden lg:table-cell">{item.email}</td>
      <td className="hidden xl:table-cell">{formatDate(item?.created_at)}</td>
      <td>
        <div className="flex items-center gap-2">
          <ActionDialog type="staff" data={item} />

          {checkRole("ADMIN") && (
            <ActionDialog type="delete" id={item.id} deleteType="staff" />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl py-6 px-3 2xl:p-6">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <Users size={20} className="text-gray-500" />
          <p className="text-2xl font-semibold">{totalRecord}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total staffs
          </span>
        </div>

        <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <SearchInput />
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <ListFilter size={20} />
            Filter
          </Button>

          {checkRole("ADMIN") && <StaffForm />}
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <Table columns={columns} renderRow={renderRow} data={data} />

        <Pagination
          totalRecords={totalRecord}
          currentPage={currentPage}
          totalPages={totalPages}
          limit={DATA_LIMIT}
        />
      </div>
    </div>
  );
};

export default ManageStaffs;
