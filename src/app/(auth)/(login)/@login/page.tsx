"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { verifyLoginSchema as formSchema } from "@/lib/zod";
import { toast } from "sonner";
import { getOtp } from "@/actions/auth";
import { client_login } from "@/actions/auth/login";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

export default function Page() {
  const [step, setStep] = React.useState<"otp" | "verify">("otp");
  const [emailValid, seEmailValid] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const [message, setMessage] = React.useState<string | undefined>(undefined);

  const [state, formAction, isPending] = React.useActionState(
    client_login,
    undefined
  );

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   try {
  //     setMessage(undefined);
  //     formAction(values);
  //   } catch (e) {
  //     console.error(e);
  //     setMessage("An unexpected errror occured!");
  //   }
  // }

  React.useEffect(() => {
    setMessage(state?.message);
  }, [state]);

  const email = form.watch("email");

  React.useEffect(() => {
    if (email) {
      form.trigger("email").then((isValid) => {
        seEmailValid(isValid);
      });
    }
  }, [email, form]);

  const otpPromise = () =>
    new Promise(async (resolve, reject) => {
      const res = await getOtp(email);

      setStep("verify");
      if (res?.status === true) {
        resolve(res);
      } else {
        reject(res);
      }
    });

  async function otpClicked() {
    if (!emailValid) return;
    toast.promise(otpPromise, {
      loading: "Loading...",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      success: (data: any) => {
        return data?.message ?? "OTP request successfull";
      },
      error: "Oops! an error occured while completing your request",
    });
  }

  return (
    <div className='min-h-96 space-y-14'>
      <Form {...form}>
        <form action={formAction} className='space-y-8'>
          <div className='w-full max-w-[358px] mx-auto space-y-4'>
            {message && (
              <p className='text-sm font-medium text-destructive'>{message}</p>
            )}

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Id</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='email'
                      {...field}
                      name='email'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {step !== "otp" && (
              <FormField
                control={form.control}
                name='otp'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        inputMode='text'
                        {...field}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot className='p-4 size-12' index={0} />
                          <InputOTPSlot className='p-4 size-12' index={1} />
                          <InputOTPSlot className='p-4 size-12' index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot className='p-4 size-12' index={3} />
                          <InputOTPSlot className='p-4 size-12' index={4} />
                          <InputOTPSlot className='p-4 size-12' index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* YWvTGh */}
          </div>

          <div className='w-full max-w-sm mx-auto text-center space-y-3'>
            {step === "verify" && (
              <Button
                disabled={form.formState.isSubmitting || isPending}
                className='py-4 h-auto rounded-full font-semibold w-full'
              >
                <span
                  className='data-[active=true]:opacity-0'
                  data-active={form.formState.isSubmitting}
                >
                  Login
                </span>

                {form.formState.isSubmitting && (
                  <div
                    role='status'
                    className='absolute w-full h-full grid place-content-center'
                  >
                    <svg
                      aria-hidden='true'
                      className='size-5 animate-spin fill-white text-white/50'
                      viewBox='0 0 100 101'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                        fill='currentColor'
                      />
                      <path
                        d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                        fill='currentFill'
                      />
                    </svg>
                    <span className='sr-only'>Loading...</span>
                  </div>
                )}
              </Button>
            )}

            <Button
              type='button'
              disabled={!emailValid}
              onClick={otpClicked}
              className='py-4 h-auto rounded-full font-semibold w-full'
              variant={step === "otp" ? undefined : "outline"}
            >
              {step === "otp" ? "Send OTP" : "Resend"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
