"use server";

import { z } from "zod";
import { api } from "@/lib/api";

const validator = z.array(z.any());

export async function getAllEvents(
  category: string = "all",
  price: string = "all",
  date?: Date | null
) {
  if (category == "all" && price == "all" && !date) {
    const request = await api(validator, {
      method: "get",
      url: `/event/getall`,
      headers: {
        // next: { revalidate: 3600 },
        cache: "no-store",
      },
    });
    return request?.data ?? [];
  }

  const request = await api(validator, {
    method: "post",
    url: `/event/filter`,
    headers: {
      // next: { revalidate: 3600 },
      cache: "no-store",
    },
    data: {
      category: category !== "all" ? category : "",
      price: price !== "all" ? price : "",
      date,
    },
  });

  return request?.data ?? [];
}
