import { getCheckins } from "@/app/actions/admin";
import TableComponent from "@/components/admin/Table";
import { ColumnDef } from "@tanstack/react-table";

// Updated Checkin type definition to reflect the processed data
interface ProcessedCheckin {
  user: {
    name: string | null;
    email: string | null;
  };
  event: {
    name: string;
  };
  createdAt: string; // Update to string to reflect the formatted date
}

export default async function CheckinsPage() {
  const checkins = await getCheckins();

  // Format the check-in date for display
  const processedCheckins: ProcessedCheckin[] = checkins.map((checkin) => ({
    ...checkin,
    createdAt: new Date(checkin.createdAt).toLocaleString(), // Format the date to a readable string
  }));

  const checkinColumns: ColumnDef<ProcessedCheckin>[] = [
    { header: "User Name", accessorKey: "user.name" }, // Access the nested user name
    { header: "User Email", accessorKey: "user.email" }, // Access the nested
    { header: "Event Name", accessorKey: "event.name" }, // Access the nested event name
    { header: "Check-in Time", accessorKey: "createdAt" }, // Access the formatted check-in time
  ];

  return (
    <div>
      <TableComponent data={processedCheckins} columns={checkinColumns} />
    </div>
  );
}
