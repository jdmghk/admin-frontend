"use server";

import { eventDataSchema } from "@/lib/zod/event";
import { auth } from "../../../auth";
import { api } from "@/lib/api";

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}
export async function getTransactions(pagination: PaginationState) {
  const session = await auth();

  if (!session || !session.user || !session?.user?.events) {
    return null;
  }

  const res = await api(eventDataSchema, {
    url: `/dashboard/${session?.user?.events[0]}/sales?page=${
      pagination.pageIndex + 1
    }&pick=${pagination.pageSize}`,
    method: "get",
  });

  return {
    rows: res?.data?.recentTransactions ?? [],
    pageCount: res.data?.pagination?.totalPages ?? 0,
    rowCount: (res?.data?.recentTransactions ?? [])?.length ?? 0,
  };
}
