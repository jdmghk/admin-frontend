import { getTickets } from "@/actions/tickets";
import TransactionsPage from "./table";

export default async function Page() {
  const defaultPagination = { pageIndex: 0, pageSize: 10 };
  const defaultData = await getTickets(defaultPagination);

  return (
    <TransactionsPage
      defaultData={defaultData?.rows ?? []}
      defaultPagination={defaultPagination}
    />
  );
}
