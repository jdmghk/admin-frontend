import { z } from "zod";

const userSchema = z.object({
  _id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  gender: z.enum(["male", "female", "other"]), // Using enum for controlled gender values
  email: z.string().email(),
  phone_number: z.number().int().positive(),
});

const eventInfoSchema = z.object({
  id: z.string(),
  ticket_type: z.string(),
  uniqueID: z.string(),
  qrCode: z.string(), // Assuming base64 QR code as a string
  check_in: z.boolean().optional(),
});

const eventSchema = z.object({
  _id: z.string(),
  user: userSchema,
  event_info: z.array(eventInfoSchema),
  payment_status: z.enum(["Free Event", "Paid Event", "success"]), // Enum for known payment statuses
  trxRef: z.string().nullable(), // trxRef is nullable
  total_cost: z.number().nonnegative(),
});

export const searchSchema = z.object({
  count: z.number(),
  results: z.array(eventSchema),
});
