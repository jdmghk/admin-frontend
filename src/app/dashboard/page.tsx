import { eventDataSchema } from "@/lib/zod/event";
import { api } from "@/lib/api";
import { auth } from "../../../auth";
import { Calendar1Icon, HandCoins, Ticket, User2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dayjs from "dayjs";

export default async function Page() {
  const session = await auth();

  if (!session || !session.user || !session?.user?.events) {
    return null;
  }

  const res = await api(eventDataSchema, {
    url: `/dashboard/${session?.user?.events[0]}/sales`,
    method: "get",
  });

  return (
    <div className='flex flex-1 flex-col gap-4 lg:p-4 pt-0'>
      <div className='aspect-[16/2] rounded-xl bg-white grid grid-cols-2 md:grid-cols-4 gap-3 p-4'>
        <div className='flex flex-col lg:flex-row items-center justify-center gap-y-2 gap-x-5'>
          <div className='p-3 lg:size-12 xl:size-16 2xl:size-24 grid place-content-center rounded-full text-white bg-[#4D44B5]'>
            <Ticket strokeWidth={1.5} className='size-6 xl:size-8' />
          </div>
          <div className='text-center lg:text-left'>
            <p className='text-lg'>No. of tickets</p>
            <p className='text-2xl font-semibold'>
              {res?.data?.ticketSales?.reduce((acc, ticket) => {
                return acc + (ticket.sold + (ticket.remaining ?? 0));
              }, 0)}
            </p>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row items-center justify-center gap-y-2 gap-x-5'>
          <div className='p-3 lg:size-12 xl:size-16 2xl:size-24 grid place-content-center rounded-full text-white bg-[#FB7D5B]'>
            <User2 strokeWidth={1.5} className='size-6 xl:size-8' />
          </div>
          <div className='text-center lg:text-left'>
            <p className='text-lg'>Tickets sold</p>
            <p className='text-2xl font-semibold'>
              {res?.data?.ticketSales?.reduce((acc, ticket) => {
                return acc + ticket.sold;
              }, 0)}
            </p>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row items-center justify-center gap-y-2 gap-x-5'>
          <div className='p-3 lg:size-12 xl:size-16 2xl:size-24 grid place-content-center rounded-full text-white bg-[#FCC43E]'>
            <Calendar1Icon strokeWidth={1.5} className='size-6 xl:size-8' />
          </div>
          <div className='text-center lg:text-left'>
            <p className='text-lg'>Checked in</p>
            <p className='text-2xl font-semibold'>
              {res?.data?.ticketSales?.reduce((acc) => {
                return acc + 0;
              }, 0)}
            </p>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row items-center justify-center gap-y-2 gap-x-5'>
          <div className='p-3 lg:size-12 xl:size-16 2xl:size-24 grid place-content-center rounded-full text-white bg-[#303972]'>
            <HandCoins strokeWidth={1.5} className='size-6 xl:size-8' />
          </div>
          <div className='text-center lg:text-left'>
            <p className='text-lg'>Total revenue</p>
            <p className='text-2xl font-semibold'>
              ₦{res?.data?.totalRevenue?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* <div className='min-h-[100vh] flex-1 rounded-xl bg-white md:min-h-min p-8 space-y-6'>
        <p className='text-3xl font-medium opacity-65'>Recent Transactions</p>
        <Table>
          <TableCaption className='py-6'>
            <Button asChild className='rounded-full p-4 px-8 h-auto'>
              <Link href='/dashboard/transactions'>See more</Link>
            </Button>
          </TableCaption>
          <TableHeader>
            <TableRow className='text-lg'>
              <TableHead className='w-[140px]'>ID</TableHead>
              <TableHead className='p-2'>Buyer</TableHead>
              <TableHead className='p-2'>Email</TableHead>
              <TableHead className='p-2'>Transaction Date</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {res?.data?.recentTransactions?.map((invoice) => (
              <TableRow key={invoice.trxRef}>
                <TableCell className='font-medium py-4'>
                  {invoice.trxRef}
                </TableCell>
                <TableCell className='py-4'>{invoice.buyerName}</TableCell>
                <TableCell className='py-4'>{invoice.email}</TableCell>
                <TableCell className='py-4'>
                  {dayjs(invoice.date).format("ddd, DD MMMM YYYY")}
                </TableCell>
                <TableCell className='text-right py-4'>
                  ₦{invoice.amount?.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}
    </div>
  );
}
