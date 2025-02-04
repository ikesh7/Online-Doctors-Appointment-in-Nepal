import { UserStatus } from "@/components/status";
import { Table } from "@/components/tables/table";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/utils";
import { clerkClient } from "@clerk/nextjs/server";
import { BriefcaseBusiness, ListFilter, Search } from "lucide-react";
import Link from "next/link";

const columns = [
  {
    header: "user ID",
    key: "id",
    className: "hidden lg:table-cell",
  },
  {
    header: "Name",
    key: "name",
  },
  {
    header: "Email",
    key: "email",
    className: "hidden md:table-cell",
  },
  {
    header: "Role",
    key: "role",
  },
  {
    header: "Status",
    key: "status",
  },
  {
    header: "Last Login",
    key: "last_login",
    className: "hidden xl:table-cell",
  },
];

interface searchParamsProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

interface UserProps {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: { emailAddress: string }[];
  publicMetadata: { role: string };
  lastSignInAt: number | string;
}

const ManageUsers = async ({ searchParams }: searchParamsProps) => {
  const client = await clerkClient();
  const { data, totalCount } = await client.users.getUserList({
    orderBy: "-created_at",
  });

  if (!data) {
    return null;
  }

  const renderRow = (item: UserProps) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
    >
      <td className="hidden lg:table-cell items-center gap-2 md:gap-4 ">
        {item.id}
      </td>

      <td className="table-cell py-2 xl:py-4">
        {item.firstName + " " + item?.lastName}
      </td>
      <td className="hidden md:table-cell">
        {item.emailAddresses[0]?.emailAddress}
      </td>
      <td className="table-cell capitalize">{item?.publicMetadata?.role}</td>
      <td className="items-center py-2 peer">
        <UserStatus status={"ACTIVE"} />
      </td>
      <td className="hidden xl:table-cell">
        {formatDateTime(new Date(item?.lastSignInAt).toString())}
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl p-2 md:p-4 2xl:p-6">
      <div className="flex items-center justify-between">
        <div className="hidden lg:flex items-center gap-1">
          <BriefcaseBusiness size={20} className="text-gray-500" />
          <p className="text-2xl font-semibold">{totalCount}</p>
          <span className="text-gray-600 text-sm xl:text-base">
            total users
          </span>
        </div>

        <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
          <div className="hidden xl:flex items-center border border-gray-300 px-2 py-2 rounded-md">
            <Search size={18} className="text-gray-400" />
            <input
              className="outline-none px-2 text-sm"
              placeholder="Search..."
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <ListFilter size={20} />
            Filter
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>
    </div>
  );
};

export default ManageUsers;
