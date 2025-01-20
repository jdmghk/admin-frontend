import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Layout({
  create,
  login,
}: {
  readonly create: React.ReactNode;
  readonly login: React.ReactNode;
}) {
  return (
    <div className='flex justify-center items-center w-full'>
      <Tabs
        defaultValue='login'
        className='w-full max-w-[535px] mx-auto space-y-8 flex flex-col'
      >
        <TabsList className='mx-auto w-full max-w-[358px] h-auto rounded-full font-semibold text-[#9C9AA5]'>
          <TabsTrigger
            value='create'
            className='w-full p-4 rounded-full data-[state=active]:bg-[#020C14] data-[state=active]:text-white'
          >
            Sign up
          </TabsTrigger>
          <TabsTrigger
            value='login'
            className='w-full p-4 rounded-full data-[state=active]:bg-[#020C14] data-[state=active]:text-white'
          >
            Sign in
          </TabsTrigger>
        </TabsList>
        <TabsContent value='create'>{create}</TabsContent>
        <TabsContent value='login'>{login}</TabsContent>
      </Tabs>
    </div>
  );
}
