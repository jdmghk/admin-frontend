import { auth } from "../../../../auth";
import { redirect, RedirectType } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/", RedirectType.replace);
  }

  if (session.user?.role === "agent") {
    redirect("/dashboard/checkins", RedirectType.replace);
  }

  return <>{children}</>;
}
