import Image from "next/image";
// import authBg from "../../../public/e8d157d29f51fcd019e65026934c921c.png";
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
    <section className='grid lg:grid-cols-2 h-screen'>
      <div className='hidden lg:block relative overflow-clip bg-primary'>
        {/* <Image
          alt='Towering multi-level building'
          src={authBg}
          placeholder='blur'
          quality={100}
          className='object-cover -z-10'
          fill
        /> */}

        <div className='p-28 flex flex-col justify-between bg-gradient-to-b from-transparent to-[#4d44b597] text-white h-full'>
          <div className='text-center flex justify-center items-center w-full'>
            {/* <h2 className='text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold'>
              Straqa
            </h2> */}
            <Image
              src='/Logos-07.svg'
              height={200}
              width={200}
              alt="Straqa Logo"
              className="size-40"
            />
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

        <div className='text-center max-w-xl mx-auto'>
          <p className='text-[#9C9AA5] [&_a]:text-[#26203B] text-sm'>
            By creating an account or using this service, you consent to the
            Company’s <Link href='#'>Terms of Use</Link> and{" "}
            <Link href='#'>Privacy Policy</Link>, and confirm that you have read
            and agree to them.
          </p>
        </div>
      </div>
    </section>
  );
}
