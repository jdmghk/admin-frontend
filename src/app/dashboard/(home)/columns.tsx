"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  buyerName: string;
  amount: number;
  payment_status: string;
  email: string;
  phone_number: number;
  date: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "payment_status",
    header: "Status",
  },
  {
    accessorKey: "buyerName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone_number",
    header: "Phone number",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = parseFloat(row.getValue("date"));

      return (
        <div>
          {dayjs(date).isValid()
            ? dayjs(date).format("ddd, DD MMMM YYYY")
            : date}
        </div>
      );
    },
  },
  {
    accessorKey: "trxRef",
    header: "Trx Reference",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return <div className='font-medium'>{formatted}</div>;
    },
  },
];
