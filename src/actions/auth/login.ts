"use server";

import { signIn } from "../../../auth";
import {
  isRedirectError,
  redirect,
  RedirectType,
} from "next/dist/client/components/redirect";
import { AuthError } from "next-auth";
// import { z } from "zod";
// import { verifyLoginSchema as formSchema } from "@/lib/zod";

export async function client_login(
  prev: { is_error: boolean; message: string } | undefined,
  formData: FormData
) {
  let errored = false;
  const email = formData.get("email");
  const otp = formData.get("otp");
  if (!email || !otp) {
    return {
      is_error: true,
      message: "Invalid form data",
    };
  }

  try {
    await signIn("credentials", { email, otp });
  } catch (e) {
    errored = true;
    console.log('login error', {e})
    if (e instanceof AuthError) {
      switch (e.type) {
        case "AccessDenied":
          return {
            is_error: true,
            message: "User not found.",
          };
        case "CredentialsSignin":
          return {
            is_error: true,
            message: "Invalid credentials.",
          };
        default:
          return {
            is_error: true,
            message: "Something went wrong.",
          };
      }
    }

    if (isRedirectError(e)) {
      throw e;
    }

    return {
      is_error: true,
      message: "An unexpected error occurred.",
    };
  } finally {
    if (!errored) {
      // redirect to users actor here

      redirect("/dashboard", RedirectType.replace);
    }
  }
}
