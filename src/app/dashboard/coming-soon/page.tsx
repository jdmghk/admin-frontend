import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function Page() {
  return (
    <main className='flex flex-1 flex-col justify-center items-center'>
      <section className='w-full max-w-screen-2xl mx-auto p-4 space-y-16 flex flex-col justify-center items-center'>
        <Image
          src='/Time management 1.svg'
          alt=''
          width={800}
          height={300}
          className='max-w-lg w-full mx-auto'
        />

        <div className='flex flex-col items-center text-center space-y-6 lg:space-y-8'>
          <div className='space-y-1.5 lg:space-y-3'>
            <h1 className='text-2xl lg:text-3xl xl:text-4xl font-medium'>
              Page coming soon
            </h1>

            <p className='xl:text-lg'>
              Kindly check back later, this page wil....
            </p>
          </div>

          <Button
            asChild
            className='py-4 px-8 rounded-full h-auto'
            variant='outline'
          >
            <Link href='/dashboard'>Return to home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
