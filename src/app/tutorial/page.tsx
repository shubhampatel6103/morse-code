import { Suspense } from "react";
import Title from "@/components/title";
import TutorialContent from "@/components/tutorialContent/tutorialContent";

export default function Tutorial() {
  return (
    <main className="bg-orange-200 min-h-screen flex flex-col items-center justify-center p-8">
      <Suspense fallback={<div>Loading...</div>}>
        <TutorialContent />
      </Suspense>
    </main>
  );
}
