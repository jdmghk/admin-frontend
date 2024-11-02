import { ticketsDataSchema } from "@/lib/zod/tickets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "../../../../../auth";
import { api } from "@/lib/api";
import dayjs from "dayjs";

export default async function Page() {
  const session = await auth();

  if (!session || !session.user || !session?.user?.events) {
    return null;
  }

  const res = await api(ticketsDataSchema, {
    url: `/dashboard/${session?.user?.events[0]}/tickets`,
    method: "get",
  });

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <Table>
        <TableHeader>
          <TableRow className='lg:text-lg'>
            <TableHead className='w-[140px]'>ID</TableHead>
            <TableHead className='p-2'>Name</TableHead>
            <TableHead className='p-2'>Email</TableHead>
            <TableHead className='p-2'>Phone</TableHead>
            <TableHead className='p-2'>Gender</TableHead>
            <TableHead className='p-2'>Ticket Type</TableHead>
            <TableHead className='p-2'>Payment Status</TableHead>
            <TableHead className='text-right'>Purchase Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res?.data?.tickets?.map((ticket, index) => (
            <TableRow key={index}>
              <TableCell className='font-medium py-4'>{ticket.id}</TableCell>
              <TableCell className='py-4'>{ticket.user.name}</TableCell>
              <TableCell className='py-4'>{ticket.user.email}</TableCell>
              <TableCell className='py-4'>{ticket.user.phone}</TableCell>
              <TableCell className='py-4'>{ticket.user.gender}</TableCell>
              <TableCell className='py-4'>
                {ticket.ticket_info.ticket_types[0]}
              </TableCell>
              <TableCell className='py-4'>
                {ticket.ticket_info.payment_status}
              </TableCell>
              <TableCell className='py-4 text-right'>
                {dayjs(ticket.ticket_info.purchase_date).format(
                  "ddd, DD MMMM YYYY"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
