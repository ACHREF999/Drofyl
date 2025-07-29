import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 pt-0 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[24px] row-start-2 items-center sm:items-start max-w-[380px]">
        <Image
          className="self-center -mb-12"
          src="/drofyl-logo.png"
          alt="Drofyl logo"
          width={380}
          height={64}
          priority
        />
        <h1 className="self-center text-5xl text-white font-semibold">Drofyl</h1>
        <p className="text-md font-medium text-gray-300"> Upload and Store all your images , videos and static files In One Click</p>
        <div className="self-center flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-[#282828] transition-colors flex items-center justify-center bg-[#1a1a1a] text-foreground shadow-sm shadow-[#888] gap-2 hover:bg-[#383838]  font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="sign-in"
            rel="noopener noreferrer"
          >
            Sign In
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] transition-colors flex items-center justify-center bg-[#f2f2f2] hover:bg-[#eeeeee]   font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] shadow-sm shadow-[#888] "
            href="/sign-up"
            rel="noopener noreferrer"
          >
          Join Us Now
          </Link>
        </div>
      </main>
      
    </div>
  );
}
