import { eventDataSchema } from "@/lib/zod/event";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "../../../../auth";
import { api } from "@/lib/api";

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
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {res?.data?.ticketSales?.map((ticket) => (
          <Card key={ticket.type} className='flex flex-col'>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div className='space-y-2'>
                  <CardTitle>{ticket.type}</CardTitle>
                  <CardDescription>
                    ₦{ticket.price?.toLocaleString()}
                  </CardDescription>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  aria-label={`Edit ${ticket.type}`}
                >
                  <Edit className='h-4 w-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent className='flex-grow'>
              <p className='text-sm text-muted-foreground mb-4'>
                {ticket.type}
              </p>
              <div className='space-y-1'>
                <p className='text-sm font-medium'>
                  Available:{" "}
                  <span className='font-normal'>{ticket.remaining}</span>
                </p>
                <p className='text-sm font-medium'>
                  Sold: <span className='font-normal'>{ticket.sold}</span>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <p className='text-sm text-muted-foreground'>
                Total: {(ticket.remaining ?? 0) + ticket.sold}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
