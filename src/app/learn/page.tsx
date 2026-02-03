import Keyboard from "@/components/keyboard/keyboard";
import Title from "@/components/title";
import Button from "@/components/button";
import { HomeIcon } from "@heroicons/react/24/solid";


export default function Learn() {
  return (
    <main className="bg-orange-200 min-h-screen flex flex-col items-center justify-center p-8">
      <Title text="Learn" />
      <div className="absolute top-4 left-4">
        <Button href="/" icon={<HomeIcon className="w-5 h-5 text-white" />} />
      </div>
      <Keyboard showSubmit={true} />
    </main>
  );
}
