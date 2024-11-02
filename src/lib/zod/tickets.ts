import { z } from "zod";

const TicketSchema = z.object({
  id: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.number(),
    gender: z.enum(["male", "female"]),
  }),
  ticket_info: z.object({
    trxRef: z.string(),
    payment_status: z.enum(["success", "pending", "failed", "Free Event"]),
    amount: z.number(),
    purchase_date: z.string().datetime(),
    ticket_types: z.array(z.string()),
  }),
  questions: z.array(z.any()),
});

const PaginationSchema = z.object({
  currentPage: z.number().int().positive(),
  totalPages: z.number().int().positive(),
  totalItems: z.number().int().positive(),
});

const EventSchema = z.object({
  title: z.string(),
  date: z.string(), // Format can be validated with custom regex if required
  time: z.string(), // Format can be validated with custom regex if required
  location: z.string(),
  slug: z.string(),
});

export const ticketsDataSchema = z.object({
  tickets: z.array(TicketSchema),
  pagination: PaginationSchema,
  event: EventSchema,
});
