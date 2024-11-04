import { auth } from "../../../auth";
import { redirect, RedirectType } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/", RedirectType.replace);
  }

  return (
    <SidebarProvider>
      <AppSidebar session={session} />
      <SidebarInset className='bg-muted/50 max-w-[100vw]'>
        <header className='flex h-16 shrink-0 items-center gap-2 bg-sidebar lg:bg-transparent transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='items-center gap-2 px-4 hidden lg:flex'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <p>
              <span className='opacity-60'>Welcome back</span>{" "}
              {session?.user?.name?.split(" ")[0]}
            </p>
          </div>

          <div className='items-center gap-2 px-4 lg:hidden flex justify-between w-full'>
            <Link href='/dashboard'>
              <Image
                src='/tickets-by-All-In-icon-logo-white.png'
                alt=''
                width={80}
                height={80}
                className='object-contain object-center size-8'
              />
            </Link>

            <SidebarTrigger className='text-white hover:bg-transparent'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </SidebarTrigger>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 lg:pt-0'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
