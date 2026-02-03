import Link from "next/link";
import Title from "@/components/title";
import Button from "@/components/button";

export default function Home() {
  return (
    <main className="bg-orange-200 min-h-screen flex flex-col items-center justify-center p-8">
      <Title text="Morse Code" />
      <div className="flex flex-col items-center space-y-4">
        <Link href="/learn">
          <Button text="Learn" />
        </Link>
        <div className="flex space-x-4">
          <Link href="/transmit">
            <Button text="Transmit" />
          </Link>
          <Link href="/receive">
            <Button text="Receive" />
          </Link>
        </div>
      </div>
    </main>
  );
}
