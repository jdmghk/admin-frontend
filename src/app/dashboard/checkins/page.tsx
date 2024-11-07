"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "sonner";
import { getTicketsScan } from "@/actions/tickets";

const FormSchema = z.object({
  id: z.string().min(2, {
    message: "ticket id must be at least 2 characters.",
  }),
});

export default function Page() {
  const [ref] = useAutoAnimate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await getTicketsScan(data.id);

      if (res?.data) {
        toast.error("Check in successful");
      } else {
        toast.error(res?.message ?? "something went wrong!");
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("something went wrong!");
    }
  }

  return (
    <Form {...form}>
      <div
        ref={ref}
        className='min-h-[80vh] flex flex-col gap-4 items-center justify-center'
      >
        <Card className='md:min-w-[465px] lg:min-w-[565px]'>
          <CardHeader>
            <CardTitle>Ticket Check in</CardTitle>
            <CardDescription>
              Check in via ticket Id set to your mail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='id'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='flex gap-2'>
                        <Input
                          className='flex-1'
                          placeholder='Ticket ID'
                          {...field}
                        />
                        <Button className='h-auto'>
                          {form.formState.isSubmitting && (
                            <Loader className='animate-spin' />
                          )}

                          <span>Check in</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </CardContent>
        </Card>

        {/* <Card className='md:min-w-[465px] lg:min-w-[565px]'>
          <CardHeader>
            <CardTitle>Ticket id</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Coming soon...</p>
          </CardContent>
        </Card> */}
      </div>
    </Form>
  );
}
