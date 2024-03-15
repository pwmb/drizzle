import Search from "@/components/search";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-10">
        <p className="flex w-full justify-center border-b p-4 lg:static lg:w-auto text-lg lg:rounded-xl lg:border">
          Sunny Weather App
        </p>
      </div>
      <Search></Search>
    </main>
  );
}
