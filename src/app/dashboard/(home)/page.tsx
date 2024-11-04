import { eventDataSchema } from "@/lib/zod/event";
import { api } from "@/lib/api";
import { auth } from "../../../../auth";
// import { Calendar1Icon, HandCoins, Ticket, User2 } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";
import { MonthlySales, TicketSales } from "./chart";
import { DataTable } from "./data-table";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { formatEventDate, getEventTimeRange } from "@/lib/utils";

export default async function Page() {
  const session = await auth();

  if (!session || !session.user || !session?.user?.events) {
    return null;
  }

  const res = await api(eventDataSchema, {
    url: `/dashboard/${session?.user?.events[0]}/sales`,
    method: "get",
  });

  const monthly_res = await api(
    z.array(z.object({ month: z.string(), qty: z.number() })),
    {
      url: `/dashboard/${session?.user?.events[0]}/chart`,
      method: "get",
    }
  );

  return (
    <div className='flex flex-1 flex-col gap-4'>
      {/* <div className='aspect-[16/2] rounded-xl bg-white grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-3 p-4'>
        <div className='flex flex-col lg:flex-row items-center justify-center gap-y-2 gap-x-5'>
          <div className='p-3 lg:size-12 xl:size-16 2xl:size-24 grid place-content-center rounded-full text-white bg-[#4D44B5]'>
            <Ticket strokeWidth={1.5} className='size-6 xl:size-8' />
          </div>
          <div className='text-center lg:text-left'>
            <p className='lg:text-lg'>No. of tickets</p>
            <p className='text-lg lg:text-2xl font-semibold'>
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
            <p className='lg:text-lg'>Tickets sold</p>
            <p className='text-lg lg:text-2xl font-semibold'>
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
            <p className='lg:text-lg'>Checked in</p>
            <p className='text-lg lg:text-2xl font-semibold'>
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
            <p className='lg:text-lg'>Total revenue</p>
            <p className='text-lg lg:text-2xl font-semibold'>
              ₦{res?.data?.totalRevenue?.toLocaleString()}
            </p>
          </div>
        </div>
      </div> */}

      <div className='grid lg:grid-cols-3 gap-4'>
        <TicketSales
          total_sold={res?.data?.event?.total_tickets_sold ?? 0}
          total_remaining={res?.data?.event?.available_tickets ?? 0}
        />

        <MonthlySales data={monthly_res?.data ?? []} />

        <Card
          style={{
            background: `url(${res?.data?.event?.imgsrc})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          className='shadow-none border-none bg-transparent overflow-clip'
        >
          <div className='bg-gradient-to-b from-black/30 to-gray-950 text-white h-full flex flex-col'>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div className='space-y-2'>
                  <CardTitle>{res?.data?.event?.title}</CardTitle>
                  <CardDescription className='text-sm text-gray-200 line-clamp-2 overflow-ellipsis'>
                    {res?.data?.event?.description ?? "No description provided"}
                  </CardDescription>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-8 text-white/80 transition-color ease-linear duration-200 hover:bg-transparent hover:text-white'
                  aria-label='Edit event'
                >
                  <Edit className='h-4 w-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent className='flex-1'></CardContent>
            <CardFooter className='flex-col items-start gap-2 text-gray-200 text-sm'>
              {res?.data?.event?.date && (
                <div className='flex space-x-3 items-center'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='size-5 flex-shrink-0'
                  >
                    <path
                      d='M2 12C2 8.229 2 6.343 3.172 5.172C4.344 4.001 6.229 4 10 4H14C17.771 4 19.657 4 20.828 5.172C21.999 6.344 22 8.229 22 12V14C22 17.771 22 19.657 20.828 20.828C19.656 21.999 17.771 22 14 22H10C6.229 22 4.343 22 3.172 20.828C2.001 19.656 2 17.771 2 14V12Z'
                      stroke='currentColor'
                      strokeWidth='1.5'
                    />
                    <path
                      d='M7 4V2.5M17 4V2.5M2.5 9H21.5'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                    />
                    <path
                      d='M18 17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18C16.7348 18 16.4804 17.8946 16.2929 17.7071C16.1054 17.5196 16 17.2652 16 17C16 16.7348 16.1054 16.4804 16.2929 16.2929C16.4804 16.1054 16.7348 16 17 16C17.2652 16 17.5196 16.1054 17.7071 16.2929C17.8946 16.4804 18 16.7348 18 17ZM18 13C18 13.2652 17.8946 13.5196 17.7071 13.7071C17.5196 13.8946 17.2652 14 17 14C16.7348 14 16.4804 13.8946 16.2929 13.7071C16.1054 13.5196 16 13.2652 16 13C16 12.7348 16.1054 12.4804 16.2929 12.2929C16.4804 12.1054 16.7348 12 17 12C17.2652 12 17.5196 12.1054 17.7071 12.2929C17.8946 12.4804 18 12.7348 18 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM8 17C8 17.2652 7.89464 17.5196 7.70711 17.7071C7.51957 17.8946 7.26522 18 7 18C6.73478 18 6.48043 17.8946 6.29289 17.7071C6.10536 17.5196 6 17.2652 6 17C6 16.7348 6.10536 16.4804 6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16C7.26522 16 7.51957 16.1054 7.70711 16.2929C7.89464 16.4804 8 16.7348 8 17ZM8 13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12C7.26522 12 7.51957 12.1054 7.70711 12.2929C7.89464 12.4804 8 12.7348 8 13Z'
                      fill='black'
                    />
                  </svg>

                  <p>{formatEventDate(res?.data?.event?.date)}</p>
                </div>
              )}

              {res?.data?.event?.time && (
                <div className='flex space-x-3 items-center'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='size-5 flex-shrink-0'
                  >
                    <path
                      d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M9.5 9.5L13 13M16 8L11 13'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>

                  <p className='break-words'>
                    {getEventTimeRange(
                      res?.data?.event?.time,
                      res?.data?.event?.duration
                    )}
                  </p>
                </div>
              )}

              <div className='flex gap-3 items-start hover:text-dark-blue/60 transition ease-linear duration-200 cursor-pointer'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-5 flex-shrink-0'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z'
                  />
                </svg>

                <Link
                  className='block'
                  href={res?.data?.event?.location_url ?? "#"}
                >
                  {res?.data?.event?.location}
                </Link>
              </div>
            </CardFooter>
          </div>
        </Card>
      </div>

      <Card className='flex-1 rounded-xl bg-white md:min-h-min shadow-none border-none'>
        <CardHeader className=''>
          <CardTitle className='flex items-center justify-between gap-3'>
            <p className='text-lg xl:text-xl 2xl:text-2xl font-medium'>
              Recent Transactions
            </p>

            <Link
              className='text-sm hover:underline underline-offset-2'
              href='/dashboard/transactions'
            >
              See more
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={res.data?.recentTransactions ?? []}
          />
        </CardContent>
      </Card>
    </div>
  );
}
