import Image from "next/image";
import authBg from "../../../public/e8d157d29f51fcd019e65026934c921c.png";
import Link from "next/link";
import { auth } from "../../../auth";
import { redirect, RedirectType } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session && session.user) {
    redirect("/dashboard", RedirectType.replace);
  }

  return (
    <section className='grid grid-cols-2 h-screen'>
      <div className='relative overflow-clip'>
        <Image
          alt='Towering multi-level building'
          src={authBg}
          placeholder='blur'
          quality={100}
          className='object-cover -z-10'
          fill
        />

        <div className='p-28 flex flex-col justify-between bg-gradient-to-b from-transparent to-[#4d44b597] text-white h-full'>
          <div className='text-center'>
            <h2 className='text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold'>
              Tickets
            </h2>
            <p className='xl:text-lg 2xl:text-xl'>By All-in</p>
          </div>

          <div className='text-center'>
            <h2 className='text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold'>
              Track Ticket Sales
            </h2>
            <p className='xl:text-lg 2xl:text-xl'>
              Monitor sales in real-time and see which tickets perform best.
            </p>
          </div>
        </div>
      </div>
      <div className='p-8 flex flex-col justify-between w-full'>
        <div className='flex-1 flex items-center justify-center w-full'>
          {children}
        </div>

        <div className='text-center max-w-96 mx-auto'>
          <p className='text-[#9C9AA5] [&_a]:text-[#26203B]'>
            By signing up to create an account I accept Company’s{" "}
            <Link href='#'>Terms of use & Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
