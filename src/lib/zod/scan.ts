import { z } from "zod";

const EventInfoSchema = z.object({
  id: z.string(),
  ticket_type: z.string(),
  price: z.number(),
  name: z.string(),
  email: z.string().email(),
  check_in: z.boolean(),
  uniqueID: z.string(),
  qrCode: z.string(), // assuming qrCode is a base64 string
});

export const scanTicketSchema = z.object({
  ticketId: z.string(),
  event_info: z.array(EventInfoSchema),
  updatedAt: z.string().datetime(),
});
