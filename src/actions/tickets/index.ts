"use server";

import { ticketsDataSchema } from "@/lib/zod/tickets";
import { auth } from "../../../auth";
import { api } from "@/lib/api";

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}
export async function getTickets(pagination: PaginationState) {
  const session = await auth();

  if (!session || !session.user || !session?.user?.events) {
    return null;
  }

  const res = await api(ticketsDataSchema, {
    url: `/dashboard/${session?.user?.events[0]}/tickets?page=${
      pagination.pageIndex + 1
    }&pick=${pagination.pageSize}`,
    method: "get",
  });

  console.log(res);

  return {
    rows: res?.data?.tickets ?? [],
    pageCount: res.data?.pagination?.totalPages ?? 0,
    rowCount: (res?.data?.tickets ?? [])?.length ?? 0,
  };
}
