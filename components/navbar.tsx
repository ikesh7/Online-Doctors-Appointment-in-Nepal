import db from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { GetLabel } from "./get-label";
import { NotificationPanel } from "./notification-panel";

export const Navbar = async () => {
  const { userId } = await auth();
  const data = await db.notification.findMany({
    where: { user_id: userId!, isRead: false },
    take: 5,
    orderBy: { created_at: "desc" },
  });

  if (!data) return null;

  return (
    <div className="p-5 flex justify-between bg-white">
      <GetLabel />
      <div className="flex items-center gap-4">
        <NotificationPanel data={data} />
        {userId ? <UserButton /> : <></>}
      </div>
    </div>
  );
};
