import { z } from "zod";
const EventSchema = z.object({
  title: z.string(),
  date: z.string(),
  slug: z.string(),
  duration: z.number(),
  time: z.string(),
  location: z.string(),
  location_url: z.string().url(),
  event_type: z.string(),
  category: z.string(),
  total_tickets: z.number(),
  total_tickets_sold: z.number(),
  available_tickets: z.number(),
  ticket_sales_percentage: z.string(),
});

const TicketSaleSchema = z.object({
  type: z.string(),
  price: z.number(),
  sold: z.number(),
  remaining: z.number().nullable(),
  revenue: z.number(),
  benefits: z.string().optional(),
  sales_percentage: z.number(),
});

const TransactionSchema = z.object({
  buyerName: z.string(),
  email: z.string().email(),
  gender: z.string(),
  phone_number: z.number(),
  trxRef: z.string(),
  amount: z.number(),
  date: z.string(),
});

const PaginationSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
});

export const eventDataSchema = z.object({
  event: EventSchema,
  ticketSales: z.array(TicketSaleSchema),
  totalRevenue: z.number(),
  recentTransactions: z.array(TransactionSchema),
  pagination: PaginationSchema,
});
