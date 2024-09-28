import { getUsers } from "@/app/actions/admin";
import TableComponent from "@/components/admin/Table";
import { ColumnDef } from "@tanstack/react-table";

interface User {
  name: string | null;
  email: string;
  role: string;
}

export default async function UsersPage() {
  const users = await getUsers();

  const userColumns: ColumnDef<User>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role" },
  ];

  return (
    <div>
      <h1>Users</h1>
      <TableComponent data={users} columns={userColumns} />
    </div>
  );
}
