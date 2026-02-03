import Keyboard from "@/components/keyboard/keyboard";
import Title from "@/components/title";

export default function Learn() {
  return (
    <main className="bg-orange-200 min-h-screen flex flex-col items-center justify-center p-8">
      <Title text="Learn" />
      <Keyboard showSubmit={true} />
    </main>
  );
}
