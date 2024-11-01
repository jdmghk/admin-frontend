import { array, number, object, string } from "zod";

export const sendLoginSchema = object({
  email: string().email(),
});

export const verifyLoginSchema = object({
  email: string().email(),
  otp: string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export const verifyLoginResponseSchema = object({
  user: object({
    _id: string(),
    email: string().email(),
    first_name: string(),
    last_name: string(),
    role: string(),
    events: array(string()),
    createdAt: string(),
    updatedAt: string(),
    __v: number(),
  }),
  token: string(),
});

export const registerSchema = object({});

export const registerResponseSchema = object({
  email: string().email(),
  first_name: string(),
  last_name: string(),
  role: string(),
  events: array(string()),
  _id: string(),
  createdAt: string(),
  updatedAt: string(),
  __v: number(),
});
