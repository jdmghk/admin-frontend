import { z } from "zod";

const EventInfoSchema = z.object({
  id: z.string(),
  ticket_type: z.string(),
  uniqueID: z.string(),
  qrCode: z.string(), // assuming qrCode is a base64 string
  check_in: z.boolean(),
});

export const scanTicketSchema = z.object({
  ticketId: z.string(),
  event_info: z.array(EventInfoSchema),
  updatedAt: z.string().datetime(),
});
