"use server";

import { api } from "@/lib/api";
import { calculateTotal } from "@/lib/utils";
import { couponSchema, eventSchema, ticketFormSchema } from "@/lib/zod";
import { z } from "zod";

const userReqRes = z.object({
  _id: z.string(),
});

const ticketReqRes = z.object({
  ticket: z.object({
    _id: z.string(),
  }),
  paystack: z.string().optional(),
});

export async function createTicket(
  props: z.infer<typeof ticketFormSchema>,
  event: z.infer<typeof eventSchema>,
  discount?: z.infer<typeof couponSchema>
) {
  try {
    const url =
      event.event_type === "Free" ? "/ticket/create-free" : "/ticket/create";

    const userCred = props.attendees[0];

    // Create a user
    const userResponse = await api(userReqRes, {
      method: "post",
      url: `/user/create`,
      data: userCred,
    });

    if (!userResponse.status || !userResponse.data) {
      return { status: false, message: "Error creating user", data: null };
    }

    const userID = userResponse.data?._id;

    // Prepare ticket data
    const data =
      event.event_type === "Free"
        ? {
            userID,
            event_info: props.tickets
              .filter((t) => t.quantity >= 1)
              .map((ticket) => ({
                id: event._id,
                ticket_type: ticket.name,
              })),
            payment_status: event.event_type === "Free" ? "Free" : "Pending",
            total_cost: calculateTotal(
              props.tickets,
              event.event_type,
              discount
            ),
            trxRef: null,
            questions: userCred.questions.map((question) => ({
              title: question.title,
              answer: question.answer,
            })),
          }
        : {
            userID,
            total_cost: calculateTotal(
              props.tickets,
              event.event_type,
              discount
            ),
            event_info: props.attendees.map((attendee) => ({
              id: event._id,
              ticket_type: attendee.ticket_type,
              price: props.tickets.find(
                (ticket) => ticket.name === attendee.ticket_type
              )?.cost,
              name: attendee.first_name + " " + attendee.last_name,
              email: attendee.email,
              check_in: false,
              questions: attendee.questions.map((question) => ({
                title: question.title,
                answer: question.answer,
              })),
            })),
          };

    // Create a ticket
    const ticketResponse = await api(ticketReqRes, {
      method: "post",
      url: url,
      data: data,
    });

    if (ticketResponse.response_code !== 201) {
      return {
        status: false,
        message: ticketResponse.message ?? "Error creating ticket",
        data: null,
      };
    }

    return {
      status: true,
      message: "Ticket created successfully",
      data: ticketResponse.data,
    };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { status: false, message: "Error creating ticket", data: null };
  }
}
