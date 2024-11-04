import { getTransactions } from "@/actions/transactions";
import TransactionsPage from "./table";

export default async function Page() {
  const defaultPagination = { pageIndex: 0, pageSize: 10 };
  const defaultData = await getTransactions(defaultPagination);

  return (
    <TransactionsPage
      defaultData={defaultData?.rows ?? []}
      defaultPagination={defaultPagination}
    />
  );
}
