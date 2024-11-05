import { z } from "zod";

export const _TransactionSchema = z.object({
  buyerName: z.string(),
  email: z.string().email(),
  gender: z.string(),
  phone_number: z.number(),
  trxRef: z.string().nullable(),
  payment_status: z.string(),
  amount: z.number(),
  date: z.string(),
  uniqueID: z.string(),
});

export const downloadTransactionsSchema = z.object({
  eventTitle: z.string(),
  transactions: z.array(_TransactionSchema),
  totalItems: z.number(),
});
